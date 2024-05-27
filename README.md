# Welkom!

Ik heb mijn app probren te hosten adhv de stappenplan in de cursus. Het is gelukt om de build in orde te krijgen,
maar wanneer de app zou moeten starten, kreeg ik een heleboel errors en ik weet niet hoe ik die moet oplossen.

Error in log:

/opt/render/project/src/project/node_modules/connect-mongodb-session/index.js:110
        var e = new Error('Error connecting to db: ' + error.message);
                ^
Error: Error connecting to db: 4058F831667F0000:error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error:../deps/openssl/openssl/ssl/record/rec_layer_s3.c:1590:SSL alert number 80
    at /opt/render/project/src/project/node_modules/connect-mongodb-session/index.js:110:1

# Dit zou de link zijn naar mijn site (maar is niet deployed): https://project-webdev-ponci.onrender.com