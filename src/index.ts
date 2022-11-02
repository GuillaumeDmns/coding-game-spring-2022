/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
import Entity from "./objects/Entity";
import Game from "./objects/Game";
import {sortEntityByThreatAndDistance} from "./utils/entity.utils";

declare function readline(args?: any): string;
let hasAchievedMinManaOnce: boolean = false;
const MIN_MANA_TO_ACHIEVE = 200;


const [baseX, baseY] = readline().split(" ").map(Number); // The corner of the map representing your base
const heroesPerPlayer: number = Number(readline()); // Always 3
const game = new Game(baseX, baseY, heroesPerPlayer);
let monstersSentToMeetingPoint: number = 0;
let hasBeenSentToMeetingPoint:Array<number> = [];

// game loop
while (true) {
  const myBaseInput: number[] = readline().split(" ").map(Number);
  const enemyBaseInput: number[] = readline().split(" ").map(Number);
  game.newTurn(
    myBaseInput[0],
    myBaseInput[1],
    enemyBaseInput[0],
    enemyBaseInput[1]
  );

  const [MEETING_POINT_X, MEETING_POINT_Y] = [baseX == 0 ? (17630-5200) : 5200, baseX == 0 ? (9000-2000) : 2000];
  const [HERO1_BASE_POINT_X, HERO1_BASE_POINT_Y] = [Math.abs(baseX - 9000), Math.abs(baseY - 1200)];
  const [HERO2_BASE_POINT_X, HERO2_BASE_POINT_Y] = [Math.abs(baseX - 2200), Math.abs(baseY - 8000)];
  const [HERO3_BASE_POINT_X, HERO3_BASE_POINT_Y] = [Math.abs(baseX - 7200), Math.abs(baseY - 8000)];

  let heroesBases: {[key: number]: [number, number]} = {};
  heroesBases[0] = [HERO1_BASE_POINT_X, HERO1_BASE_POINT_Y];
  heroesBases[1] = [HERO2_BASE_POINT_X, HERO2_BASE_POINT_Y];
  heroesBases[2] = [HERO3_BASE_POINT_X, HERO3_BASE_POINT_Y];

  const entityCount: number = Number(readline()); // Amount of heros and monsters you can see
  for (let i = 0; i < entityCount; i++) {
    const inputs: number[] = readline().split(" ").map(Number);
    game.addEntity(
      new Entity(
        inputs[0], // Unique identifier
        inputs[1], // 0=monster, 1=your hero, 2=opponent hero
        inputs[2], // Position of this entity
        inputs[3],
        inputs[4], // Ignore for this league; Count down until shield spell fades
        inputs[5], // Ignore for this league; Equals 1 when this entity is under a control spell
        inputs[6], // Remaining health of this monster
        inputs[7], // Trajectory of this monster
        inputs[8],
        inputs[9], // 0=monster with no target yet, 1=monster targeting a base
        inputs[10], // Given this monster's trajectory, is it a threat to 1=your base, 2=your opponent's base, 0=neither
        game.me
      )
    );
  }

  let monsters: Array<Entity> = game.entities.filter(e => e.type == e.TYPE_MONSTER).sort((a, b) => sortEntityByThreatAndDistance(a, b, baseX, baseY));
  let myHeroes: Array<Entity> = game.entities.filter(e => e.type === e.TYPE_MY_HERO);

  let actions: {[key: number]: string} = {};

  if (!hasAchievedMinManaOnce) {
    if (game.me.mana > MIN_MANA_TO_ACHIEVE) {
      hasAchievedMinManaOnce = true;
    }
    for (let i: number = 0; i < heroesPerPlayer; i++) {
      const thisHero: Entity = myHeroes.filter(e => e.id % 3 == i)[0];
      let monstersOfThisHero: Array<Entity> = monsters.filter(e => e.getDistanceFrom(thisHero.x, thisHero.y) < 2200).sort((a, b) => sortEntityByThreatAndDistance(a, b, baseX, baseY));

      if (monstersOfThisHero.length > 0) {
        let dangerousMonsters = monstersOfThisHero.filter(m => m.isDangerousForMyBase());

        if (dangerousMonsters.length > 0) {
          actions[thisHero.id] = 'MOVE ' + dangerousMonsters[0].x + ' ' + dangerousMonsters[0].y;
        }
        else {
          if (monstersOfThisHero[0].health > 5) {
            actions[thisHero.id] = 'MOVE ' + monstersOfThisHero[0].x + ' ' + monstersOfThisHero[0].y;
          }
          else {
            actions[thisHero.id] = 'MOVE ' + heroesBases[thisHero.id % 3][0] + ' ' + heroesBases[thisHero.id % 3][1];
          }
        }
      } else {
        actions[thisHero.id] = 'MOVE ' + heroesBases[thisHero.id % 3][0] + ' ' + heroesBases[thisHero.id % 3][1];
      }
    }
    for (let i = 0; i < heroesPerPlayer; i++) {
      console.log(actions[Object.keys(actions)[i]]);
    }
  }
  else {
    for (let i = 0 + (baseX == 0 ? 0 : 3); i < heroesPerPlayer + (baseX == 0 ? 0 : 3); i++) {
      if ((myHeroes.filter(h => h.id === i)[0].getDistanceFrom(MEETING_POINT_X, MEETING_POINT_Y) > 1280) && monstersSentToMeetingPoint < 15) {
        // control a strong monster to the opponent's base
        let monstersAround: Array<Entity> = game.entities
          .filter(e => e.type == e.TYPE_MONSTER && !(hasBeenSentToMeetingPoint.indexOf(e.id) > -1) && (e.threatFor != 2) && e.getDistanceFrom(myHeroes.filter(h => h.id === i)[0].x, myHeroes.filter(h => h.id === i)[0].y) < 2200)
          .sort((a, b) => b.health - a.health);

        if (monstersAround.length > 0) {
          console.log("SPELL CONTROL " + monstersAround[0].id + " " + MEETING_POINT_X + " " + MEETING_POINT_Y);
          hasBeenSentToMeetingPoint.push(monstersAround[0].id);
          monstersSentToMeetingPoint++;
        }
        else {
          console.log("MOVE " + MEETING_POINT_X + " " + MEETING_POINT_Y);
        }
      }
      else {
        if (game.me.mana > 30) {
          const monstersAroundAllMyHeroes: Array<Entity> = monsters.filter(m => myHeroes.reduce((acc, h) => acc + (h.getDistanceFrom(m.x, m.y) < 1280 ? 1 : 0), 0) > 1);
          if (monstersAroundAllMyHeroes.length > 0) {
            console.log("SPELL WIND " + (monstersAroundAllMyHeroes[0].x + Math.abs(baseX - 17630) - monstersAroundAllMyHeroes[0].x) + " " + (monstersAroundAllMyHeroes[0].y + Math.abs(baseY - 9000) - monstersAroundAllMyHeroes[0].y));
          }
          else {
            console.log("MOVE " + MEETING_POINT_X + " " + MEETING_POINT_Y + " pause chiasse");

          }
        }
        else {
          console.log("MOVE " + MEETING_POINT_X + " " + MEETING_POINT_Y);
        }
      }
    }
  }
}
