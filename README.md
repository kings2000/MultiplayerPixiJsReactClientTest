# React + TypeScript + Vite

#Project Structure;

The project is designed with the following structure

App -> Login -> Menu -> Experience 

The Experience is the game world where the MainContainer is rendered. The MainContainer is like the GameState, which holds the players and rules for the game. In this project it was a very simple integration. 

The MainContainer is where most of the data from the websocket is pulled, and the websocket is as a service on its own. Data pulled is sent directly to the target classes from processing.

Since the position data pulled from the server is in sequence I was able to use a simple formula to handle a smooth motion between the last position and target position in the Hero or Bot class. This ensures the movement is not stepped but smooth with custom speed. (Note: The current processed position from the server was divided by 2, so it can fit into the play area).
