# FROM nginx:alpine

# LABEL maintainer="tjveil@gmail.com"

# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 26257
# EXPOSE 8080

# CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine

WORKDIR /app

RUN apk add --no-cache bash

LABEL maintainer="tjveil@gmail.com"

# Copy the Nginx configuration file
COPY . .

# Copy the entrypoint script
# COPY entrypoint.sh /

# Make the entrypoint script executable
RUN chmod +x ./entrypoint.sh

# Expose ports
EXPOSE 26257
EXPOSE 8080

# Set the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]

# The CMD directive can be used to specify default arguments for ENTRYPOINT
CMD ["nginx", "-g", "daemon off;"]