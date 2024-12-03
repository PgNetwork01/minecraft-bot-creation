// Moving the Bot
const mineflayer = require('mineflayer');

const moveBot = mineflayer.createBot({
  host: 'localhost', // Replace with your server's IP
  port: 25565,       // Replace with your server's port
  username: 'MoveBot', // Replace with desired bot username
});

moveBot.on('spawn', () => {
  moveBot.chat('I am moving forward!');
  moveBot.setControlState('forward', true);
  setTimeout(() => {
    moveBot.setControlState('forward', false);
    moveBot.chat('I stopped moving!');
  }, 5000);
});

// Breaking Blocks
const breakerBot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'BreakerBot',
});

breakerBot.on('spawn', () => {
  breakerBot.chat('I am ready to break a block!');
  const block = breakerBot.blockAt(breakerBot.entity.position.offset(0, -1, 0));
  if (block) {
    breakerBot.chat(`Breaking block: ${block.name}`);
    breakerBot.dig(block, (err) => {
      if (err) {
        breakerBot.chat(`Failed to break block: ${err.message}`);
      } else {
        breakerBot.chat('Block broken!');
      }
    });
  } else {
    breakerBot.chat('No block to break!');
  }
});

// Placing Blocks
const placerBot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'PlacerBot',
});

placerBot.on('spawn', () => {
  placerBot.chat('I am ready to place a block!');
  const blockToPlace = placerBot.inventory.items().find(item => item.name === 'dirt');
  if (!blockToPlace) {
    placerBot.chat('No dirt block found in inventory!');
    return;
  }

  placerBot.equip(blockToPlace, 'hand', (err) => {
    if (err) {
      placerBot.chat(`Failed to equip block: ${err.message}`);
      return;
    }

    const position = placerBot.entity.position.offset(1, 0, 0); // Place block to the right
    const referenceBlock = placerBot.blockAt(position);

    if (referenceBlock && referenceBlock.name === 'air') {
      placerBot.placeBlock(referenceBlock, vec3(0, 1, 0), (err) => {
        if (err) {
          placerBot.chat(`Failed to place block: ${err.message}`);
        } else {
          placerBot.chat('Block placed successfully!');
        }
      });
    } else {
      placerBot.chat('Cannot place block here!');
    }
  });
});

// Combined Actions with Commands
const commandBot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'CommandBot',
});

commandBot.on('chat', (username, message) => {
  if (username === commandBot.username) return;

  if (message === 'move') {
    commandBot.chat('Moving forward for 5 seconds...');
    commandBot.setControlState('forward', true);
    setTimeout(() => {
      commandBot.setControlState('forward', false);
      commandBot.chat('Stopped moving!');
    }, 5000);
  }

  if (message === 'break') {
    commandBot.chat('Breaking block beneath...');
    const block = commandBot.blockAt(commandBot.entity.position.offset(0, -1, 0));
    if (block) {
      commandBot.dig(block, (err) => {
        if (err) {
          commandBot.chat(`Failed to break block: ${err.message}`);
        } else {
          commandBot.chat('Block broken!');
        }
      });
    } else {
      commandBot.chat('No block to break!');
    }
  }

  if (message === 'place') {
    commandBot.chat('Placing a dirt block next to me...');
    const blockToPlace = commandBot.inventory.items().find(item => item.name === 'dirt');
    if (!blockToPlace) {
      commandBot.chat('No dirt block in inventory!');
      return;
    }

    commandBot.equip(blockToPlace, 'hand', (err) => {
      if (err) {
        commandBot.chat(`Failed to equip block: ${err.message}`);
        return;
      }

      const position = commandBot.entity.position.offset(1, 0, 0);
      const referenceBlock = commandBot.blockAt(position);

      if (referenceBlock && referenceBlock.name === 'air') {
        commandBot.placeBlock(referenceBlock, vec3(0, 1, 0), (err) => {
          if (err) {
            commandBot.chat(`Failed to place block: ${err.message}`);
          } else {
            commandBot.chat('Block placed successfully!');
          }
        });
      } else {
        commandBot.chat('Cannot place block here!');
      }
    });
  }
});
