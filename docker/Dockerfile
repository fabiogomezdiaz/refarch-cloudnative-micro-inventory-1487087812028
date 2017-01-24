FROM node:6.9.4
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# IBM vulnerability advisor policies
RUN sed -i -e '/^PASS_MIN_DAYS/ s/0/1/' /etc/login.defs
RUN sed -i -e '/^PASS_MAX_DAYS/ s/99999/90/' /etc/login.defs
RUN sed -i -e '/^password.*pam_unix.so/ s/$/ minlen=8/' /etc/pam.d/common-password

# Install prereqs
#RUN apt-get update && apt-get install -y jq

# Copy agent files
#COPY agents/ /agents/

# Add the new relic agent
#RUN wget https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic-java.zip -O /tmp/newrelic.zip \
#  && unzip -u -d /agents /tmp/newrelic.zip newrelic/newrelic.jar \
#  && rm /tmp/newrelic.zip

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package.json
RUN npm install

# Bundle app source
COPY bin bin
COPY lib lib
COPY public public
COPY routes routes
COPY views views
COPY app.js app.js

EXPOSE 3000
CMD ["npm", "start"]