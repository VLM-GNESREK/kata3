// Constants for item names and quality limits
const MAX_QUALITY = 50;
const MIN_QUALITY = 0;
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const AGED_BRIE = 'Aged Brie';
const BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';
const CONJURED = 'Conjured Mana Cake';
const SULFURAS_QUALITY = 80; // Sulfuras always has a quality of 80

/**
 * Base Item class representing a generic item's behavior.
 * All other specific item types will inherit from this.
 */
class Item {
  constructor(name, sell_in, quality) {
    this.name = name;
    this.sell_in = sell_in;
    this.quality = quality;
  }

  // Common logic for decreasing quality (for most items)
  _decreaseQuality(amount = 1) {
    if (this.quality > MIN_QUALITY) {
      this.quality -= amount;
    }
    // Ensure quality never drops below 0
    if (this.quality < MIN_QUALITY) {
        this.quality = MIN_QUALITY;
    }

    if (this.quality > MAX_QUALITY)
    {
      this.quality = MAX_QUALITY;
    }
  }

  // Common logic for increasing quality (for items like Aged Brie)
  _increaseQuality(amount = 1) {
    if (this.quality < MAX_QUALITY) {
      this.quality += amount;
    }
    // Ensure quality never exceeds 50 (except Sulfuras, handled in its class)
    if (this.quality > MAX_QUALITY) {
        this.quality = MAX_QUALITY;
    }

    if (this.quality > MAX_QUALITY)
    {
      this.quality = MAX_QUALITY;
    }
  }

  // Common logic for decreasing SellIn
  _decreaseSellIn() {
    this.sell_in -= 1;
  }

  // The main update method to be overridden by specific item types
  update() {
    this._decreaseQuality();
    this._decreaseSellIn();

    if (this.sell_in < 0) {
      this._decreaseQuality(); // Quality degrades twice as fast after sell_in date
    }
  }
}

/**
 * Specific Item Type: Aged Brie
 * Increases in Quality the older it gets.
 * Quality never more than 50.
 */
class AgedBrie extends Item {
  constructor(sell_in, quality) {
    super(AGED_BRIE, sell_in, quality);
  }

  update() {
    this._increaseQuality();
    this._decreaseSellIn();

    if (this.sell_in < 0) {
      this._increaseQuality(); // Aged Brie increases quality even faster after sell_in
    }
  }
}

/**
 * Specific Item Type: Backstage passes
 * Increases in Quality as its SellIn value approaches:
 * - Quality increases by 2 when there are 10 days or less
 * - Quality increases by 3 when there are 5 days or less
 * - Quality drops to 0 after the concert.
 * Quality never more than 50.
 */
class BackstagePasses extends Item {
  constructor(sell_in, quality) {
    super(BACKSTAGE_PASSES, sell_in, quality);
  }

  update() {
    this._increaseQuality(); // Increases by 1 normally

    if (this.sell_in < 11) {
      this._increaseQuality(); // Increases by 1 more (total 2)
    }
    if (this.sell_in < 6) {
      this._increaseQuality(); // Increases by 1 more (total 3)
    }

    this._decreaseSellIn();

    if (this.sell_in < 0) {
      this.quality = MIN_QUALITY; // Quality drops to 0 after concert
    }
  }
}

/**
 * Specific Item Type: Sulfuras, Hand of Ragnaros
 * Legendary item, never has to be sold or decreases in Quality.
 * Quality is always 80.
 */
class Sulfuras extends Item {
  constructor(sell_in) {
    super(SULFURAS, sell_in, SULFURAS_QUALITY); // Sulfuras always has 80 quality
  }

  // Sulfuras overrides update to do nothing, as its quality and sell_in never change.
  update() {
    // Do nothing: Sulfuras never changes
  }
}

/**
 * Specific Item Type: Conjured Mana Cake
 * "Conjured" items degrade in Quality twice as fast as normal items.
 */
class Conjured extends Item {
    constructor(sell_in, quality) {
        super(CONJURED, sell_in, quality);
    }

    update() {
        this._decreaseQuality(2); // Degrades twice as fast
        this._decreaseSellIn();

        if (this.sell_in < 0) {
            this._decreaseQuality(2); // Degrades twice as fast after sell_in
        }
    }
}

/**
 * Factory function to create the correct Item subclass based on name.
 * This abstracts the item creation logic.
 */
function createItem(name, sell_in, quality) {
  switch (name) {
    case AGED_BRIE:
      return new AgedBrie(sell_in, quality);
    case BACKSTAGE_PASSES:
      return new BackstagePasses(sell_in, quality);
    case SULFURAS:
      return new Sulfuras(sell_in); // Quality is fixed at 80 for Sulfuras
    case CONJURED:
      return new Conjured(sell_in, quality);
    default:
      return new Item(name, sell_in, quality); // Default for all other items
  }
}

/**
 * The main update function for the Gilded Rose system.
 * Now takes items as an argument and delegates updates to each item.
 */
function update_quality(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].update(); // Each item knows how to update itself
  }
}