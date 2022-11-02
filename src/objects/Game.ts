import Player from "./Player";
import Entity from "./Entity";

class Game {
  ACTION_WAIT = "WAIT";
  ACTION_MOVE = "MOVE";
  ACTION_SPELL = "SPELL";
  SPELL_WIND = "WIND";
  SPELL_CONTROL = "CONTROL";
  SPELL_SHIELD = "SHIELD";

  me: Player;
  enemy: Player;
  entities: Entity[];

  constructor(baseX: number, baseY: number, private heroes: number) {
    this.me = new Player(baseX, baseY, 3, 0);
    this.enemy = new Player(
      baseX === 0 ? 17630 : 0,
      baseY === 0 ? 9000 : 0,
      3,
      0
    );
    this.entities = [];
  }

  newTurn = (
    health: number,
    mana: number,
    enemyHealth: number,
    enemyMana: number
  ) => {
    this.me.setHealth(health);
    this.me.setMana(mana);
    this.enemy.setHealth(enemyHealth);
    this.enemy.setMana(enemyMana);
    this.entities = [];
  };

  addEntity = (entity: Entity) => {
    this.entities.push(entity);
  };

  nextAction = (hero: number): string => {
    // In the first league: MOVE <x> <y> | WAIT; In later leagues: | SPELL <spellParams>;

    return this.ACTION_WAIT;
  };
}

export default Game;
