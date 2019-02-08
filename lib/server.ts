import {application} from './app';

const PORT = 3000;

application.initialize()
    .then(() => application.app.listen(PORT, () => {
            console.log('Express server listening on port ' + PORT);
        })
    );


