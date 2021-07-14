export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

const AGED_BRIE = 'Aged Brie';
const CONCERT = 'Backstage passes to a TAFKAL80ETC concert';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const MAXIMAL_QUALITY = 50;
const MINIMAL_QUALITY = 0;
const EXPIRED_DATE = 0;
const QUALITY_INCREASE_FACTOR = 1;
const QUALITY_DECREASE_FACTOR = 1;
const SELL_IN_DECREASE_FACTOR = 1;
const PREVIOUS_WEEK_THRESHOLD = 10;
const CURRENT_WEEK_THRESHOLD = 5;

export class GildedRose {
    items: Array<Item>;

    constructor(items = [] as Array<Item>) {
        this.items = items;
    }

    updateQuality() {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            
            if (this.isCommon(item)) {
                if (!this.isLegendary(item)) {
                    this.decreaseQuality(item);
                }
            }

            if(!this.isCommon(item)) {
                this.increaseQuality(item);

                if (this.isAConcert(item)) {
                    if (this.isAtPreviousWeek(item)) {
                        this.increaseQuality(item);
                    }
                    if (this.isAtCurrentWeek(item)) {
                        this.increaseQuality(item);
                    }
                }
            }

            this.decreaseSellIn(item);

            if (this.hasExpired(item)) {
                
                if (this.isCommon(item)) {
                    if (!this.isLegendary(item)) {
                        this.decreaseQuality(item);
                    }
                }

                if (this.isAConcert(item)) {
                    this.decreaseQualityToZero(item);
                }

                if(this.isAgedBrie(item)) {
                    this.increaseQuality(item);
                }
            }
        }
        
        return this.items;
    }

    private decreaseQualityToZero(item: Item) {
        item.quality = item.quality - item.quality;
    }

    private decreaseSellIn(item: Item) {
        if (!this.isExpirable(item)) return
        item.sellIn = item.sellIn - SELL_IN_DECREASE_FACTOR;
    }

    private increaseQuality(item: Item) {
        if (!this.hasEnoughQuality(item)) return
        item.quality = item.quality + QUALITY_INCREASE_FACTOR;
    }

    private decreaseQuality(item: Item) {
        if (!this.hasSomeQuality(item)) return
            item.quality = item.quality - QUALITY_DECREASE_FACTOR;
    }

    private isAtCurrentWeek(current: Item) {
        return current.sellIn <= CURRENT_WEEK_THRESHOLD;
    }

    private isAtPreviousWeek(current: Item) {
        return current.sellIn <= PREVIOUS_WEEK_THRESHOLD;
    }

    private isAConcert(current: Item) {
        return current.name === CONCERT;
    }

    private hasSomeQuality(current: Item) {
        return current.quality > MINIMAL_QUALITY;
    }

    private hasExpired(current: Item) {
        return current.sellIn < EXPIRED_DATE;
    }

    private isExpirable(current: Item) {
        return !this.isLegendary(current);
    }

    private isLegendary(current: Item) {
        return current.name === SULFURAS;
    }

    private isCommon(current: Item) {
        return !this.isAgedBrie(current) && !this.isAConcert(current);
    }

    private isAgedBrie(current: Item) {
        return current.name === AGED_BRIE;
    }

    private hasEnoughQuality(current: Item) {
        return current.quality < MAXIMAL_QUALITY;
    }
}