import * as fs from 'fs';
import readline from 'readline';
import {google, drive_v3} from 'googleapis';
import ConfigService from './configService';

export default class GoogleDriveService {
    private driveClient: drive_v3.Drive;
    private configService: ConfigService;
    private SCOPES: string[];
    private TOKEN_PATH: string;
    private CREDENTIALS_PATH: string;

    constructor (configService: ConfigService){
        this.configService = configService;

        // Load client secrets from a local file.
        fs.readFile(this.CREDENTIALS_PATH, (err: any, content: any) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            this.authorize(JSON.parse(content), this.initialize);
        });
    }

    /**
     * 
     */
    initialize(auth: string) {
        this.driveClient = google.drive({version: 'v3', auth});
        // If modifying these scopes, delete token.json.
        this.SCOPES = this.configService.getEnv().google.scope;
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        this.TOKEN_PATH = this.configService.getEnv().google.token_path;
        this.CREDENTIALS_PATH = this.configService.getEnv().google.credentials_path;
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize(credentials: any, callback: Function) {
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
    
        // Check if we have previously stored a token.
        fs.readFile(this.TOKEN_PATH, (err: any, token: any) => {
            if (err) return this.getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }
    
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    getAccessToken(oAuth2Client: any, callback: any) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code: string) => {
            rl.close();
            oAuth2Client.getToken(code, (err: any, token: string) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err: any) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', this.TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }
    
    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    listFiles(auth: any) {
        this.driveClient.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        }, (err: any, res: any) => {
            if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file: any) => {
                    console.log(`${file.name} (${file.id})`);
                });
            } else {
                console.log('No files found.');
            }
        });
    }

    /**
     * 
     */
    fileCreate() {
        const folderId = this.configService.getEnv().google.work_dir;
        // const fileMetadata = {
        //     name: 'photo.jpg',
        //     parents: [folderId]
        // };
        // const media = {
        //     mimeType: 'image/jpeg',
        //     body: fs.createReadStream('files/photo.jpg')
        // };
        // this.driveClient.files.create({
        //     resource: fileMetadata,
        //     media: media,
        //     fields: 'id'
        // }, (err: any, file: any) => {
        //     if (err) {
        //         // Handle error
        //         console.error(err);
        //     } else {
        //         console.log('File Id: ', file.id);
        //     }
        // });
    }
}