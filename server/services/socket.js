var _ = require('lodash');

var Mongo = require('./mongo-service');

module.exports = {
    events: (io) => {
        console.log('io.on');
        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('join-wall', (wall_id) => {
                console.log('join-wall', wall_id);

                _.forEach(socket.rooms, (eachRoom, index) => {
                    console.log(eachRoom, index);
                    socket.leave(eachRoom);
                });

                socket.join(wall_id);

                Mongo.findDocuments('notes', {wall: wall_id}, {}, (notes) => io.to(wall_id).emit('notes', notes));
                Mongo.findDocuments('sections', {wall: wall_id}, {}, (sections) => io.to(wall_id).emit('sections', sections));
            });

            socket.on('add-user', (user) => {
                Mongo.insertDocument('users', user, (result, err) => {
                    if (err) socket.emit('email-exists');
                    else Mongo.findDocuments('users', user, {}, (users) => socket.emit('valid-user', users[0]));
                });
            });

            socket.on('check-user', (user) => {
                console.log('check-user', user);
                Mongo.findDocuments('users', user, {}, (users) => {
                    if (users[0]) socket.emit('valid-user', users[0]);
                    else socket.emit('invalid-login');
                });
            });

            socket.on('get-wall', (wall_id) => {
                Mongo.findDocuments('walls', {_id: wall_id}, {}, (walls) => socket.emit('wall', walls[0]));
            });

            socket.on('save-wall', (wall) => {
                Mongo.updateDocument('walls', {_id: wall._id}, wall, () => socket.broadcast.to(wall._id).emit('wall', wall));
            });

            socket.on('add-wall', (wall) => {
                Mongo.insertDocument('walls', wall, () => {
                    Mongo.findDocuments('walls', {}, {}, (walls) => socket.emit('wall-list', walls));
                });
            });

            socket.on('get-walls', (wall) => {
                Mongo.findDocuments('walls', {}, {}, (walls) => socket.emit('wall-list', walls));
            });

            socket.on('remove-wall', (wall) => {
                Mongo.removeDocument('walls', {_id: wall._id}, () => {
                    Mongo.findDocuments('walls', {}, {}, (walls) => socket.emit('wall-list', walls));
                });
            });

            socket.on('add-note', (note) => {
                Mongo.insertDocument('notes', note, () => {
                    Mongo.findDocuments('notes', {wall: note.wall}, {}, (notes) => io.to(note.wall).emit('notes', notes));
                });
            });

            socket.on('remove-note', (note) => {
                Mongo.removeDocument('notes', {_id: note._id}, () => {
                    Mongo.findDocuments('notes', {wall: note.wall}, {}, (notes) => io.to(note.wall).emit('notes', notes));
                });
            });

            socket.on('update-note', (note) => {
                socket.broadcast.to(note.wall).emit('note-' + note._id, note);
            });

            socket.on('save-note', (note) => {
                Mongo.updateDocument('notes', {_id: note._id}, note, (notes) => socket.broadcast.to(note.wall).emit('note-' + note._id, note));
            });

            socket.on('add-section', (section) => {
                Mongo.insertDocument('sections', section, () => {
                    Mongo.findDocuments('sections', {wall: section.wall}, {}, (sections) => io.to(section.wall).emit('sections', sections));
                });
            });

            socket.on('remove-section', (section) => {
                Mongo.removeDocument('sections', {_id: section._id}, () => {
                    Mongo.findDocuments('sections', {wall: section.wall}, {}, (sections) => io.to(section.wall).emit('sections', sections));
                });
            });

            socket.on('update-section', (section) => {
                socket.broadcast.to(section.wall).emit('section-' + section._id, section);
            });

            socket.on('save-section', (section) => {
                Mongo.updateDocument('sections', {_id: section._id}, section, (sections) => socket.broadcast.to(section.wall).emit('section-' + section._id, section));
            });
        });

        io.on('disconnect', () => console.log('user disconnected'));
    }
};