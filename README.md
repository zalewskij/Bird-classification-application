# Bird-classification-application
This repository contains the application for the engineering thesis. The application consists of two parts: frontend and backend.

## Frontend
The frontend is running on [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/), and is using [Vite](https://vitejs.dev/). The design is based on [Ant Design](https://ant.design/).

### Installation
To run the application in development mode, [node.js](https://nodejs.org/en/download) is neccessary.
Run `npm install` in the `frontend/bird-classification` directory to install all necessary packages. After installation, `node_modules` can take up to 400 MB.

### Starting the application
All commands should be run in in the `frontend/bird-classification` directory.

- To start development server, run `npm run dev`.
- To locally preview production build, run `npm run preview`.
- To build for production, run `npm run build`.
- To run frontend unit tests, run `npm run test`

To use the frontend, it is neccessary to start the backend, and set the correct backend address in file `frontend/bird-classification/src/components/Results.tsx`, e.g. `const BACKEND_URL = 'http://127.0.0.1:5000/analyze-audio';`.

## Backend
The backend is running on [Python](https://www.python.org/downloads/), using [Flask](https://flask.palletsprojects.com/en/3.0.x/installation/) for the web server and [Pytorch](https://pytorch.org/) for running the machine learning model. The application uses the following packages:
- Flask (version 2.1.2)
- Flask_Cors (version 4.0.0)
- librosa (version 0.10.1)
- numpy (version 1.21.6)
- pandas (version 1.3.5)
- pytest (version 7.1.2)
- torch (version 1.11.0+cpu)

They can be be installed using `pip`.

### Starting the application
- To start the application, run `python application.py` in the `backend/api` directory.
- To start backend tests, run `pytest` in the `backend` directory.