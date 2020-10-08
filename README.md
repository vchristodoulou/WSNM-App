# Application for Wireless Sensor Networks Management

Built with Angular 8 and Bootstrap 4. <br>
Application features:
* Create an account.
* Login.
* Reserve timeslots for experiments.
* See connected nodes information.
* Upload executable files.
* Run experiments:
    * Program, erase, reset nodes connected to system.
    * Get debug data produced by nodes at real-time with WebSockets. 
    * Download Experiment Log that contains all data produced by nodes.

### Installation
1) Install npm
    - `sudo apt install npm`

2) Install NodeJS
    - `sudo npm cache clean -f`
    - `sudo npm install -g n`
    - `sudo n stable`

3) Install application dependencies
    - `sudo npm install` (from application root directory)

### Configuration
You can adjust the project settings with the following file:
- `src/app/env.ts`

### Build
* Run `npm run build` to build the project.
* Run `npm run prod` to build a production-ready project.

The build artifacts will be stored in the `dist/` directory. Copy directory to 
[WSNM-WebService/src](https://github.com/vchristodoulou/WSNM-WebService/tree/master/src) 
to serve application from Web Service.


### Development server
Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

