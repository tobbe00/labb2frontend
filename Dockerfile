FROM node:14

WORKDIR /app

# Kopiera över package.json och package-lock.json för att installera beroenden
COPY ./package.json /app/
COPY ./package-lock.json /app/

# Installera alla beroenden (inklusive devDependencies)
RUN npm install

# Kopiera all kod från din lokala frontend-mapp till containern
COPY . /app

# Exponera porten som React utvecklingsservern kommer att använda
EXPOSE 3000

# Starta utvecklingsservern (React) i utvecklingsläge
CMD ["npm", "start"]
