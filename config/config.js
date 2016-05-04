/** Config */

module.exports = {
    file_upload_folder: '/gallery',
    radius: 0.05, /** distance in km */
    radiusEarth: 6378.1, /** equatorial radius of earth */
    radiusRes: 0.00000783932, /** radius/radiusEarth */
    domain: 'http://localhost:3000',
    public_folder: '/public',
    tokenLife: 3600,
    google_config: {
        key: 'AIzaSyAbLmYhDJodnB3ZTFIqvn2vr3O_gouM6wQ',
        stagger_time:       1000, // for elevationPath
        encode_polylines:   false,
        secure:             false // use https
    }
};
