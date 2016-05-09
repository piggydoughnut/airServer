/** Config */

module.exports = {
    file_upload_folder: '/gallery',
    radius: 0.5, /** distance in km */
    radiusEarth: 6378.1, /** equatorial radius of earth */
    radiusRes: 7.83932519e-5, /** radius/radiusEarth = radians */
    domain: 'http://localhost:3000',
    public_folder: '/public',
    tokenLife: 3600,
    google_config: {
        key: 'AIzaSyAbLmYhDJodnB3ZTFIqvn2vr3O_gouM6wQ',
        stagger_time:       1000, // for elevationPath
        encode_polylines:   false,
        secure:             false // use https
    },
    client_id: '57251d1b26a3c20f8d65c343SecretId',
    client_secret: '57251d1b26a3c20f8d65c343SecretTest'
};
