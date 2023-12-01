import time
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS  # Corrected import
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_httpauth import HTTPBasicAuth
# from sqlalchemy.dialects.postgresql import UUID
# import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import PickleType

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DB_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
auth = HTTPBasicAuth()

user_group = db.Table('user_group',
    db.Column('user_id', db.BigInteger, db.ForeignKey('user.id'), primary_key=True),
    db.Column('group_id', db.BigInteger, db.ForeignKey('group.id'), primary_key=True)
)

user_event = db.Table('user_event',
    db.Column('user_id', db.BigInteger, db.ForeignKey('user.id'), primary_key=True),
    db.Column('event_id', db.BigInteger, db.ForeignKey('event.id'), primary_key=True)
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
    events = db.relationship('Event', secondary=user_event, backref=db.backref('event_attendees', lazy='dynamic'))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Group(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    user_ids = db.Column(MutableList.as_mutable(PickleType), default=[])
    admin_ids = db.Column(MutableList.as_mutable(PickleType), default=[])

class Event(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    group_id = db.Column(db.BigInteger, db.ForeignKey('group.id'), nullable=False)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(250))
    time = db.Column(db.DateTime, nullable=False)
    attendees = db.Column(MutableList.as_mutable(PickleType), default=[])

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
    users_paginated = User.query.paginate(page=page, per_page=per_page, error_out=False)
    users = [{'id': u.id, 'email': u.email} for u in users_paginated.items]

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
    return jsonify({'id': new_user.id}), 201

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
    groups = [{'group_id': group.id, 'group_name': group.name} for group in user_groups]

    
    return jsonify({
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'groups': groups
    }), 200

@app.route('/user/<int:user_id>/groups', methods=['GET'])
def get_user_groups(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user_groups = Group.query.filter(Group.users.any(id=user_id)).all()
    result = [{'group_id': group.id, 'group_name': group.name} for group in user_groups]

    return jsonify(result), 200

@app.route('/group', methods=['POST'])
def create_group():
    name = request.json.get('name')
    user_ids = request.json.get('user_ids', [])  # Expecting a list of user IDs
    
    if not name:
        return jsonify({'message': 'Name is required'}), 400
    if not isinstance(user_ids, list):
        return jsonify({'message': 'user_ids must be a list'}), 400

    # Check if all user IDs exist
    for user_id in user_ids:
        if not User.query.get(user_id):
            return jsonify({'message': f'User ID {user_id} not found'}), 404

    creator_id = request.json.get('creator_id')

    if not User.query.get(creator_id):
        return jsonify({'message': 'Creator user does not exist'}), 404

    new_group = Group(name=name, user_ids=user_ids, admin_ids=[creator_id])
    db.session.add(new_group)
    db.session.commit()
    return jsonify({'id': new_group.id}), 201


# Route to get group details
@app.route('/groups/<string:group_id_str>', methods=['GET'])
def get_group(group_id_str):
    try:
        group_id = int(group_id_str)
    except ValueError:
        return jsonify({"error": "Invalid group ID format"}), 400
    group = Group.query.get_or_404(group_id)
    users = [{'id': u.id, 'email': u.email, 'first_name': u.first_name, 'last_name': u.last_name} for u in group.users]

    return jsonify({'id': group.id, 'name': group.name, 'users': users}), 200

@app.route('/group/<string:group_id_str>/add_admin', methods=['PUT'])
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
    current_user_id = request.user.id

    # Check if the current user is an admin
    if current_user_id not in group.admin_ids:
        return jsonify({'message': 'Permission denied'}), 403

    # Check if the user to add is already an admin
    if admin_id_to_add in group.admin_ids:
        return jsonify({'message': 'User is already an admin'}), 409

    # Check if the user to add exists
    if not User.query.get(admin_id_to_add):
        return jsonify({'message': 'User to add as admin does not exist'}), 404

    group.admin_ids.append(admin_id_to_add)
    db.session.commit()
    return jsonify({'message': 'Admin added to the group'}), 200

@app.route('/group/<string:group_id_str>/remove_admin', methods=['PUT'])
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
    current_user_id = request.user.id

    # Check permission and ensure not removing self as the last admin
    if current_user_id not in group.admin_ids or (len(group.admin_ids) == 1 and current_user_id == admin_id_to_remove):
        return jsonify({'message': 'Permission denied'}), 403

    if admin_id_to_remove not in group.admin_ids:
        return jsonify({'message': 'User is not an admin of this group'}), 404

    group.admin_ids.remove(admin_id_to_remove)
    db.session.commit()
    return jsonify({'message': 'Admin removed from the group'}), 200

def validate_users(user_ids):
    return next(
        (
            (False, user_id)
            for user_id in user_ids
            if not User.query.get(user_id)
        ),
        (True, None),
    )

@app.route('/event', methods=['POST'])
def create_event():
    group_id = request.json.get('group_id')
    title = request.json.get('title')
    description = request.json.get('description')
    event_time = utc.localize(datetime.strptime(request.json.get('time'), '%Y-%m-%d %H:%M:%S'))
    attendees = request.json.get('attendees', [])  # Expecting a JSON array of user IDs

    valid, invalid_id = validate_users(attendees)
    if not valid:
        return jsonify({'message': f'Invalid attendee ID: {invalid_id}'}), 404

    if not isinstance(attendees, list):
        return jsonify({'message': 'Attendees must be a list'}), 400

    group = Group.query.get_or_404(group_id)
    current_user_id = request.user.id

    if current_user_id not in group.admin_ids:
        return jsonify({'message': 'Only admins can create events for this group'}), 403

    new_event = Event(group_id=group_id, title=title, description=description, time=event_time, attendees=attendees)
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'id': new_event.id}), 201

@app.route('/event/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    current_user_id = request.user.id

    if current_user_id not in event.group.admin_ids:
        return jsonify({'message': 'Only admins of this group can update its events'}), 403

    event.title = request.json.get('title', event.title)
    event.description = request.json.get('description', event.description)
    attendees = request.json.get('attendees', event.attendees)

    valid, invalid_id = validate_users(attendees)
    if not valid:
        return jsonify({'message': f'Invalid attendee ID: {invalid_id}'}), 404

    if not isinstance(attendees, list):
        return jsonify({'message': 'Attendees must be a list'}), 400

    event.attendees = attendees

    db.session.commit()
    return jsonify({'id': event.id}), 200


@app.route('/group/<int:group_id>/add_users', methods=['PUT'])
def add_users_to_group(group_id):
    group = Group.query.get_or_404(group_id)
    user_ids = request.json.get('user_ids')

    for user_id in user_ids:
        user = User.query.get_or_404(user_id)
        group.users.append(user)

    db.session.commit()
    return jsonify({'message': 'Users added to group'}), 200

@app.route('/group/<int:group_id>/remove_users', methods=['PUT'])
def remove_users_from_group(group_id):
    group = Group.query.get_or_404(group_id)
    user_ids = request.json.get('user_ids')

    for user_id in user_ids:
        user = User.query.get_or_404(user_id)
        group.users.remove(user)

    db.session.commit()
    return jsonify({'message': 'Users removed from group'}), 200


@app.route('/user/<int:user_id>/groups_events', methods=['GET'])
def get_user_groups_events(user_id):
    user = User.query.get_or_404(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user_groups = Group.query.filter(Group.user_ids.contains(str(user_id))).all()
    result = []

    for group in user_groups:
        group_info = {'group_id': group.id, 'group_name': group.name, 'events': []}
        events = Event.query.filter_by(group_id=group.id).all()

        for event in events:
            event_info = {
                'event_id': event.id,
                'title': event.title,
                'description': event.description,
                'time': event.time.strftime('%Y-%m-%d %H:%M:%S'),
                'attendees': []
            }

            attendee_ids = event.attendees.split(',') if event.attendees else []
            for attendee_id in attendee_ids:
                attendee = User.query.get(attendee_id)
                if attendee:
                    attendee_info = {'id': attendee.id, 'email': attendee.email}
                    event_info['attendees'].append(attendee_info)

            if 'full' in request.args and request.args['full'].lower() == 'true':
                # Include full event information
                group_info['events'].append(event_info)
            else:
                # Include only event IDs if full details not requested
                group_info['events'].append({'event_id': event.id})

        result.append(group_info)

    return jsonify(result), 200

@app.route('/group/<int:group_id>/events', methods=['GET'])
def get_group_events(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({'message': 'Group not found'}), 404

    events = Event.query.filter_by(group_id=group_id).all()
    event_list = []

    for event in events:
        if 'full' in request.args and request.args['full'].lower() == 'true':
            # Include full event information
            event_info = {
                'event_id': event.id,
                'title': event.title,
                'description': event.description,
                'time': event.time.strftime('%Y-%m-%d %H:%M:%S'),
                'attendees': []
            }

            attendee_ids = event.attendees.split(',') if event.attendees else []
            for attendee_id in attendee_ids:
                attendee = User.query.get(attendee_id)
                if attendee:
                    attendee_info = {'id': attendee.id, 'email': attendee.email}
                    event_info['attendees'].append(attendee_info)

            event_list.append(event_info)
        else:
            # Include only event IDs
            event_list.append({'event_id': event.id})

    return jsonify({'group_id': group_id, 'events': event_list}), 200
