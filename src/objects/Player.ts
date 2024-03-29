class Player {
  constructor(
    public basePosX: number,
    public basePosY: number,
    public baseHealth: number,
    public mana: number
  ) {}
  setHealth = (value: number) => {
    this.baseHealth = value;
  };
  setMana = (value: number) => {
    this.mana = value;
  };
  canCast = (): boolean => {
    return this.mana >= 10;
  };
}

export default Player;
