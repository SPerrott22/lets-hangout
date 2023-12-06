import time
import pytz
from flask import Flask, request, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity,  jwt_required
from flask_cors import CORS  # Corrected import
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_httpauth import HTTPBasicAuth
# from sqlalchemy.dialects.postgresql import UUID
# import uuid
# from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
# from sqlalchemy.ext.mutable import MutableList
# from sqlalchemy import PickleType
import argon2
from argon2 import PasswordHasher
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DB_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
auth = HTTPBasicAuth()
ph = PasswordHasher()

app.config['JWT_SECRET_KEY'] = 'pokemon'  # Use a secure secret key
jwt = JWTManager(app)


user_group = db.Table('user_group',
    db.Column('user_id', db.BigInteger, db.ForeignKey('user.id'), primary_key=True),
    db.Column('group_id', db.BigInteger, db.ForeignKey('group.id'), primary_key=True)
)

user_event = db.Table('user_event',
    db.Column('user_id', db.BigInteger, db.ForeignKey('user.id'), primary_key=True),
    db.Column('event_id', db.BigInteger, db.ForeignKey('event.id'), primary_key=True)
)

group_admin = db.Table('group_admin',
    db.Column('user_id', db.BigInteger, db.ForeignKey('user.id'), primary_key=True),
    db.Column('group_id', db.BigInteger, db.ForeignKey('group.id'), primary_key=True)
)

# Models
class User(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    # id = db.Column(UUID(as_uuid=True), primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    password_hash = db.Column(db.String(256))
    groups = db.relationship('Group', secondary=user_group, backref=db.backref('users', lazy='dynamic'))
    events = db.relationship('Event', secondary=user_event, backref=db.backref('attendees', lazy='dynamic'))

    def set_password(self, password):
        self.password_hash = ph.hash(password)

    def check_password(self, password):
        return ph.verify(self.password_hash, password)

class Group(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    # user_ids = db.Column(MutableList.as_mutable(PickleType), default=[])
    # admin_ids = db.Column(MutableList.as_mutable(PickleType), default=[])
    admin_ids = db.relationship('User', secondary=group_admin, backref=db.backref('admin_groups', lazy='dynamic'))


class Event(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    group_id = db.Column(db.BigInteger, db.ForeignKey('group.id'), nullable=False)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(1000))
    start_time = db.Column(db.DateTime, nullable=False)  # New start_time column
    end_time = db.Column(db.DateTime, nullable=False)    # New end_time column
    # attendees = db.Column(MutableList.as_mutable(PickleType), default=[])

# Create the database tables
# Create the database tables within an application context
with app.app_context():
    db.create_all()

def standard_error_response(message, status_code):
    return jsonify({'error': message}), status_code

@app.errorhandler(404)
def not_found(error):
    return standard_error_response('Not found', 404)

@auth.verify_password
def verify_password(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user

@app.route('/users', methods=['GET'])
def get_users():
    page = max(request.args.get('page', 1, type=int), 1)
    per_page = min(max(request.args.get('per_page', 10, type=int), 1), 100)

    # Retrieve query parameters for email and name search
    search_email = request.args.get('email', type=str)
    search_name = request.args.get('name', type=str)

    # Base query
    query = User.query

    # Filter by similar email if provided
    if search_email:
        query = query.filter(User.email.ilike(f'%{search_email}%'))

    # Filter by similar name if provided
    if search_name:
        search_pattern = f'%{search_name}%'
        query = query.filter(db.or_(
            User.first_name.ilike(search_pattern),
            User.last_name.ilike(search_pattern),
            (User.first_name + " " + User.last_name).ilike(search_pattern)
        ))

    users_paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    users = [{'id': str(u.id), 'email': u.email, 'first_name': u.first_name, 'last_name': u.last_name} for u in users_paginated.items]

    return jsonify({
        'users': users,
        'total': users_paginated.total,
        'pages': users_paginated.pages,
        'current_page': page
    }), 200


# Routes
@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 409

    new_user = User(email=email, first_name=first_name, last_name=last_name)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': str(new_user.id)}), 201

@app.route('/users/<string:user_id_str>', methods=['GET'])
def get_user(user_id_str):
    try:
        user_id = int(user_id_str)
    except ValueError:
        return jsonify({"error": "Invalid user ID format"}), 400
    user = User.query.get_or_404(user_id)
    # user_groups = Group.query.filter(Group.user_ids.contains(str(user_id))).all()
    # groups = [{'group_id': group.id, 'group_name': group.name} for group in user_groups]
    user_groups = Group.query.filter(Group.users.any(id=user_id)).all()
    groups = [{'group_id': str(group.id), 'group_name': group.name} for group in user_groups]


    return jsonify({
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'groups': groups
    }), 200

@app.route('/user/<string:user_id_str>/groups', methods=['GET'])
def get_user_groups(user_id_str):
    try:
        user_id = int(user_id_str)
    except ValueError:
        return jsonify({"error": "Invalid user ID format"}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user_groups = Group.query.filter(Group.users.any(id=user_id)).all()
    result = [{'group_id': str(group.id), 'group_name': group.name} for group in user_groups]

    return jsonify(result), 200

@app.route('/group/<string:group_id_str>/leave', methods=['POST'])
@jwt_required()
def leave_group(group_id_str):
    try:
        group_id = int(group_id_str)
    except ValueError:
        return jsonify({"error": "Invalid group ID format"}), 400

    try:
        current_user_email = get_jwt_identity()
        current_user = User.query.filter_by(email=current_user_email).first()
        if not current_user:
            return jsonify({"error": "User not found"}), 404

        group = Group.query.get(group_id)
        if not group:
            return jsonify({"message": "Group not found"}), 404

        if current_user not in group.users:
            return jsonify({"message": "User is not a member of this group"}), 403

        if current_user in group.admin_ids and len(group.admin_ids) == 1:
            return jsonify({"message": "Cannot leave the group as the sole admin"}), 403

        group.users.remove(current_user)
        if current_user in group.admin_ids:
            group.admin_ids.remove(current_user)

        db.session.commit()
        return jsonify({"message": "Successfully left the group"}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500



# @app.route('/group', methods=['POST'])
# def create_group():
#     name = request.json.get('name')
#     user_ids = request.json.get('user_ids', [])  # Expecting a list of user IDs
#     creator_id = request.json.get('creator_id')

#     if not name:
#         return jsonify({'message': 'Name is required'}), 400
#     if not isinstance(user_ids, list):
#         return jsonify({'message': 'user_ids must be a list'}), 400

#     if not (admin := User.query.get(creator_id)):
#         return jsonify({'message': 'Creator user does not exist'}), 404


#     new_group = Group(name=name)
#     db.session.add(new_group)

#     new_group.admin_ids.append(admin)

#     # Check if all user IDs exist
#     for user_id in user_ids:
#         if user := User.query.get(user_id):
#             new_group.users.append(user)
#         else:
#             return jsonify({'message': f'User ID {user_id} not found'}), 404

#     db.session.commit()
#     return jsonify({'id': new_group.id}), 201

@app.route('/group', methods=['POST'])
def create_group():
    name = request.json.get('name')
    user_ids = request.json.get('user_ids', [])  # Expecting a list of user IDs
    creator_id = request.json.get('creator_id')

    if not name:
        return jsonify({'message': 'Name is required'}), 400
    if not isinstance(user_ids, list):
        return jsonify({'message': 'user_ids must be a list'}), 400
    if not (creator := User.query.get(creator_id)):
        return jsonify({'message': 'Creator user does not exist'}), 404

    new_group = Group(name=name)
    db.session.add(new_group)  # Add the group to the session first

    new_group.admin_ids.append(creator)  # Add creator as admin

    invalid_user_ids = []
    for user_id in user_ids:
        if user := User.query.get(user_id):
            new_group.users.append(user)
        else:
            invalid_user_ids.append(str(user_id))

    if invalid_user_ids:
        db.session.rollback()  # Rollback if there are invalid user IDs
        return jsonify({'message': f'User IDs not found: {invalid_user_ids}'}), 404

    db.session.commit()  # Commit the transaction
    return jsonify({'id': str(new_group.id)}), 201


# Route to get group details
@app.route('/groups/<string:group_id_str>', methods=['GET'])
def get_group(group_id_str):
    try:
        group_id = int(group_id_str)
    except ValueError:
        return jsonify({"error": "Invalid group ID format"}), 400
    group = Group.query.get_or_404(group_id)
    users = [{'id': str(u.id), 'email': u.email, 'first_name': u.first_name, 'last_name': u.last_name} for u in group.users]

    return jsonify({'id': str(group.id), 'name': group.name, 'users': users}), 200

@app.route('/group/<string:group_id_str>/add_admin', endpoint='add_admin', methods=['PUT'])
@jwt_required()
def add_admin_to_group(group_id_str):
    try:
        group_id = int(group_id_str)
    except ValueError:
        return jsonify({"error": "Invalid group ID format"}), 400
    admin_id_to_add = request.json.get('admin_id')

    # Validate admin_id_to_add
    if not isinstance(admin_id_to_add, int):
        return jsonify({'message': 'Invalid admin ID'}), 400

    group = Group.query.get_or_404(group_id)
    admin_to_add = User.query.get_or_404(admin_id_to_add, description="User to add as admin does not exist")

    current_user_email = get_jwt_identity()  # Assuming request.user is a User instance
    current_user = User.query.filter_by(email=current_user_email).first()

    # Check if the current user is an admin
    if current_user not in group.admin_ids:
        return jsonify({'message': 'Permission denied'}), 403

    # Check if the user to add is already an admin
    if admin_to_add in group.admin_ids:
        return jsonify({'message': 'User is already an admin'}), 409

    # Add the user as an admin
    group.admin_ids.append(admin_to_add)
    db.session.commit()

    return jsonify({'message': 'Admin added to the group'}), 200



# @app.route('/group/<string:group_id_str>/add_admin', methods=['PUT'])
# def add_admin_to_group(group_id_str):
#     try:
#         group_id = int(group_id_str)
#     except ValueError:
#         return jsonify({"error": "Invalid group ID format"}), 400

#     admin_id_to_add = request.json.get('admin_id')

#     # Validate admin_id_to_add
#     if not isinstance(admin_id_to_add, int):
#         return jsonify({'message': 'Invalid admin ID'}), 400

#     group = Group.query.get_or_404(group_id)
#     current_user = request.user

#     # Check if the current user is an admin
#     if current_user not in group.admin_ids:
#         return jsonify({'message': 'Permission denied'}), 403

#     # Check if the user to add is already an admin
#     if admin_id_to_add in group.admin_ids:
#         return jsonify({'message': 'User is already an admin'}), 409

#     # Check if the user to add exists
#     if not User.query.get(admin_id_to_add):
#         return jsonify({'message': 'User to add as admin does not exist'}), 404

#     group.admin_ids.append(admin_id_to_add)
#     db.session.commit()
#     return jsonify({'message': 'Admin added to the group'}), 200

@app.route('/group/<string:group_id_str>/remove_admin', endpoint='remove_admin', methods=['PUT'])
@jwt_required()
def remove_admin_from_group(group_id_str):
    try:
        group_id = int(group_id_str)
    except ValueError:
        return jsonify({"error": "Invalid group ID format"}), 400

    admin_id_to_remove = request.json.get('admin_id')

    # Validate admin_id_to_remove
    if not isinstance(admin_id_to_remove, int):
        return jsonify({'message': 'Invalid admin ID'}), 400

    group = Group.query.get_or_404(group_id)
    admin_to_remove = User.query.get_or_404(admin_id_to_remove, description="Admin to remove does not exist")

    current_user_email = get_jwt_identity()  # Assuming request.user is a User instance
    current_user = User.query.filter_by(email=current_user_email).first()

    # Check permission and ensure not removing self as the last admin
    if current_user not in group.admin_ids or (len(group.admin_ids) == 1 and current_user == admin_to_remove):
        return jsonify({'message': 'Permission denied'}), 403

    # Check if the user to remove is an admin
    if admin_to_remove not in group.admin_ids:
        return jsonify({'message': 'User is not an admin of this group'}), 404

    # Remove the user as an admin
    group.admin_ids.remove(admin_to_remove)
    db.session.commit()

    return jsonify({'message': 'Admin removed from the group'}), 200

# @app.route('/group/<string:group_id_str>/remove_admin', methods=['PUT'])
# def remove_admin_from_group(group_id_str):
#     try:
#         group_id = int(group_id_str)
#     except ValueError:
#         return jsonify({"error": "Invalid group ID format"}), 400

#     admin_id_to_remove = request.json.get('admin_id')

#     # Validate admin_id_to_remove
#     if not isinstance(admin_id_to_remove, int):
#         return jsonify({'message': 'Invalid admin ID'}), 400

#     group = Group.query.get_or_404(group_id)
#     current_user_id = request.user.id

#     # Check permission and ensure not removing self as the last admin
#     if current_user_id not in group.admin_ids or (len(group.admin_ids) == 1 and current_user_id == admin_id_to_remove):
#         return jsonify({'message': 'Permission denied'}), 403

#     if admin_id_to_remove not in group.admin_ids:
#         return jsonify({'message': 'User is not an admin of this group'}), 404

#     group.admin_ids.remove(admin_id_to_remove)
#     db.session.commit()
#     return jsonify({'message': 'Admin removed from the group'}), 200

def validate_users(user_ids):
    return next(
        (
            (False, user_id)
            for user_id in user_ids
            if not User.query.get(user_id)
        ),
        (True, None),
    )

@app.route('/event', endpoint='create_event', methods=['POST'])
@jwt_required()
def create_event():
    group_id = int(request.json.get('group_id'))
    title = request.json.get('title')
    description = request.json.get('description')

    # Convert start_time and end_time strings to datetime objects
    start_time_str = request.json.get('start_time')
    end_time_str = request.json.get('end_time')
    start_time = datetime.strptime(start_time_str, '%Y-%m-%d %H:%M')
    end_time = datetime.strptime(end_time_str, '%Y-%m-%d %H:%M')
    start_time = pytz.utc.localize(start_time)
    end_time = pytz.utc.localize(end_time)

    attendees = [int(user_id) for user_id in request.json.get('attendees', [])]  # Expecting a JSON array of user IDs

    valid, invalid_id = validate_users(attendees)
    if not valid:
        return jsonify({'message': f'Invalid attendee ID: {invalid_id}'}), 404

    if not isinstance(attendees, list):
        return jsonify({'message': 'Attendees must be a list'}), 400

    group = Group.query.get_or_404(group_id)
    current_user_email = get_jwt_identity()  # Assuming request.user is a User instance
    current_user = User.query.filter_by(email=current_user_email).first()

    if current_user not in group.admin_ids:
        return jsonify({'message': 'Only admins can create events for this group'}), 403

    new_event = Event(group_id=group_id, title=title, description=description,
                      start_time=start_time, end_time=end_time)
    db.session.add(new_event)

    for user_id in attendees:
      new_event.attendees.append(User.query.get(user_id))

    db.session.commit()
    return jsonify({'id': str(new_event.id)}), 201

@app.route('/event/<string:event_id_str>', methods=['PUT'])
@jwt_required()
def update_event(event_id_str):
    try:
        event_id = int(event_id_str)
    except ValueError:
        return jsonify({"error": "Invalid event ID format"}), 400

    try:
        event = Event.query.get_or_404(event_id)
        group = Group.query.get_or_404(event.group_id)

        current_user_email = get_jwt_identity()
        current_user = User.query.filter_by(email=current_user_email).first()

        if current_user not in group.users:
            return jsonify({'message': 'User is not a member of this group'}), 403

        data = request.json
        is_admin = current_user in group.admin_ids

        if is_admin:
            # Admin updating event details
            title = data.get('title')
            description = data.get('description')
            start_time_str = data.get('start_time')
            end_time_str = data.get('end_time')

            if title is not None:
                event.title = title
            if description is not None:
                event.description = description
            if start_time_str:
                event.start_time = pytz.utc.localize(datetime.strptime(start_time_str, '%Y-%m-%d %H:%M'))
            if end_time_str:
                event.end_time = pytz.utc.localize(datetime.strptime(end_time_str, '%Y-%m-%d %H:%M'))

            if 'attendees' in data:
                attendee_ids = [int(x) for x in set(data['attendees'])]
                valid_users = User.query.filter(User.id.in_(attendee_ids)).all()
                if len(valid_users) != len(attendee_ids):
                    return jsonify({'message': 'Invalid attendee IDs'}), 400

                valid_group_members = [user for user in valid_users if group in user.groups]
                if len(valid_group_members) != len(attendee_ids):
                    return jsonify({'message': 'Some attendees are not in the group'}), 400

                event.attendees = valid_group_members

        elif 'attendees' in data and len(data) == 1:
            # User RSVP'ing to event
            if current_user in event.attendees:
                event.attendees.remove(current_user)
            else:
                event.attendees.append(current_user)
        else:
            return jsonify({'message': 'Permission denied'}), 403

        db.session.commit()
        return jsonify({'id': str(event.id)}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/group/<string:group_id_str>/add_users', methods=['PUT'])
def add_users_to_group(group_id_str):
    try:
        group_id = int(group_id_str)
    except ValueError:
        return jsonify({"error": "Invalid group ID format"}), 400
    group = Group.query.get_or_404(group_id)
    user_ids = request.json.get('user_ids')

    current_user_ids = {user.id for user in group.users}
    new_users_added = False

    for user_id in user_ids:
        if user_id not in current_user_ids:
          user = User.query.get_or_404(user_id)
          group.users.append(user)
          new_users_added = True

    if new_users_added:
      db.session.commit()
    return jsonify({'message': 'Users added to group'}), 200

@app.route('/group/<string:group_id_str>/remove_users', methods=['PUT'])
def remove_users_from_group(group_id_str):
    try:
        group_id = int(group_id_str)
    except ValueError:
        return jsonify({"error": "Invalid group ID format"}), 400
    group = Group.query.get_or_404(group_id)
    user_ids = request.json.get('user_ids')

    current_user_ids = {user.id for user in group.users}  # Set of existing user IDs in the group
    users_removed = False

    for user_id in user_ids:
        if user_id in current_user_ids:
          user = User.query.get_or_404(user_id)
          group.users.remove(user)
          users_removed = True

    if users_removed:
      db.session.commit()
    return jsonify({'message': 'Users removed from group'}), 200


@app.route('/user/<string:user_id_str>/groups_events', endpoint='groups_events', methods=['GET'])
@jwt_required()
def get_user_groups_events(user_id_str):
    try:
        user_id = int(user_id_str)
    except ValueError:
        return jsonify({"error": "Invalid user ID format"}), 400

    current_user_email = get_jwt_identity()  # Assuming request.user is a User instance
    current_user = User.query.filter_by(email=current_user_email).first()

    user = User.query.get_or_404(user_id)

    if current_user != user:
        return jsonify({'message': 'Permission denied'}), 403

    result = []
    for group in user.groups:
        group_info = {'group_id': str(group.id), 'group_name': group.name, 'events': []}
        for event in Event.query.filter_by(group_id=group.id).all():
            event_info = {
                'event_id': str(event.id),
                'title': event.title,
                'description': event.description,
                'start_time': event.start_time.strftime('%Y-%m-%d %H:%M'),
                'end_time': event.end_time.strftime('%Y-%m-%d %H:%M'),
                'attendees': [{'id': str(attendee.id), 'email': str(attendee.email)} for attendee in event.attendees]
            }

            if 'full' in request.args and request.args['full'].lower() == 'true':
                group_info['events'].append(event_info)
            else:
                group_info['events'].append({'event_id': str(event.id)})

        result.append(group_info)

    return jsonify(result), 200



    # if not user:
    #     return jsonify({'message': 'User not found'}), 404

    # user_groups = Group.query.filter(Group.user_ids.contains(str(user_id))).all()
    # result = []

    # for group in user_groups:
    #     group_info = {'group_id': group.id, 'group_name': group.name, 'events': []}
    #     events = Event.query.filter_by(group_id=group.id).all()

    #     for event in events:
    #         event_info = {
    #             'event_id': event.id,
    #             'title': event.title,
    #             'description': event.description,
    #             'time': event.time.strftime('%Y-%m-%d %H:%M'),
    #             'attendees': []
    #         }

    #         attendee_ids = event.attendees.split(',') if event.attendees else []
    #         for attendee_id in attendee_ids:
    #             if attendee := User.query.get(attendee_id):
    #                 attendee_info = {'id': attendee.id, 'email': attendee.email}
    #                 event_info['attendees'].append(attendee_info)

    #         if 'full' in request.args and request.args['full'].lower() == 'true':
    #             # Include full event information
    #             group_info['events'].append(event_info)
    #         else:
    #             # Include only event IDs if full details not requested
    #             group_info['events'].append({'event_id': event.id})

    #     result.append(group_info)

    # return jsonify(result), 200

@app.route('/group/<string:group_id_str>/events', methods=['GET'])
def get_group_events(group_id_str):
    try:
        group_id = int(group_id_str)
    except ValueError:
        return jsonify({"error": "Invalid group ID format"}), 400

    group = Group.query.get_or_404(group_id)

    events = Event.query.filter_by(group_id=group.id).all()
    event_list = []

    for event in events:
        event_info = {
            'event_id': str(event.id),
            'title': event.title,
            'description': event.description,
            'start_time': event.start_time.strftime('%Y-%m-%d %H:%M'),
            'end_time': event.end_time.strftime('%Y-%m-%d %H:%M')
        }

        if 'full' in request.args and request.args['full'].lower() == 'true':
            # Include full event information along with attendees
            event_info['attendees'] = [{'id': str(attendee.id), 'email': attendee.email} for attendee in event.attendees]
            event_list.append(event_info)
        else:
            # Include only event IDs
            event_list.append({'event_id': str(event.id)})

    return jsonify({'group_id': str(group_id), 'events': event_list}), 200

    # group = Group.query.get(group_id)
    # if not group:
    #     return jsonify({'message': 'Group not found'}), 404

    # events = Event.query.filter_by(group_id=group_id).all()
    # event_list = []

    # for event in events:
    #     if 'full' in request.args and request.args['full'].lower() == 'true':
    #         # Include full event information
    #         event_info = {
    #             'event_id': event.id,
    #             'title': event.title,
    #             'description': event.description,
    #             'time': event.time.strftime('%Y-%m-%d %H:%M'),
    #             'attendees': []
    #         }

    #         attendee_ids = event.attendees.split(',') if event.attendees else []
    #         for attendee_id in attendee_ids:
    #             if attendee := User.query.get(attendee_id):
    #                 attendee_info = {'id': attendee.id, 'email': attendee.email}
    #                 event_info['attendees'].append(attendee_info)

    #         event_list.append(event_info)
    #     else:
    #         # Include only event IDs
    #         event_list.append({'event_id': event.id})

    # return jsonify({'group_id': group_id, 'events': event_list}), 200

@app.route('/login', methods = ['POST'])
@auth.login_required
def login():
  try:
    current_user = auth.current_user()
    if current_user is None:
        return jsonify({"error":"Invalid credentials"}), 401
    access_token = create_access_token(identity=current_user.email)
    return jsonify(token=access_token, user_id=str(current_user.id), user_email=current_user.email), 200
  except argon2.exceptions.VerifyMismatchError:
    return jsonify({"error": "Invalid username or password"}), 401
  except Exception as e:
    return jsonify({"error": str(e)}), 500
