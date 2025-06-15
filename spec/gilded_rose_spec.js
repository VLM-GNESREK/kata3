describe("Gilded Rose", function() 
{

  it("should foo", function() 
  {
    items = [ new Item("foo", 0, 0) ];
    update_quality();
    expect(items[0].name).toEqual("foo");
  });

  it("should ensure every item has a 'sell_in' property", function()
  {
    const newItem = new Item("Test Item", 5, 10);
    expect(newItem.sell_in).toBeDefined();
    expect(typeof newItem.sell_in).toEqual('number');
  });

  it("should ensure every item has a 'quality' property", function()
  {
    const newItem = new Item("Test Item2", 5, 10);
    expect(newItem.quality).toBeDefined();
    expect(typeof newItem.quality).toEqual('number');
  });

  it("should decrease the quality each day", function() 
  {
    items = [new Item("foo2", 10, 10)];
    update_quality();
    expect(items[0].quality).toEqual(9);
  });

  it("should decrease the quality each day after sell by date twice as fast", function() 
  {
    items = [new Item("foo2", 0, 10)];
    update_quality();
    expect(items[0].quality).toEqual(8);
  });

  it("should prevent negative items", function() 
  {
    items = [new Item("foo2", 0, 0)];
    update_quality();
    expect(items[0].quality).toEqual(0);
  });

  it("should increase quality of 'Aged Brie' the older it gets", function() 
  {
    items = [new Item("Aged Brie", 2, 10)];
    update_quality();
    expect(items[0].quality).toEqual(11);
  });

  it("should never have an item with quality over 50", function() 
  {
    items = [new Item("foo2", 10, 55)];
    update_quality();
    expect(items[0].quality).toEqual(50);
  });

  it("should never decrease the quality of Sulfuras", function() 
  {
    items = [new Item("Sulfuras, Hand of Ragnaros", 0, 80)];
    update_quality();
    expect(items[0].quality).toEqual(80);
  });

  it("should increase quality of concert tickets as date approaches and loose all value with concert", function() 
  {
    items = [new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20)];
    for(var i = 0; i < 5; i++) { update_quality(); }
    expect(items[0].quality).toEqual(25);
    for(var i = 0; i < 5; i++) { update_quality(); }
    expect(items[0].quality).toEqual(35);
    for(var i = 0; i < 5; i++) { update_quality(); }
    expect(items[0].quality).toEqual(50);
    update_quality();
    expect(items[0].quality).toEqual(0);
  });

  it("should decrease the quality of conjured items twice as fast", function() 
  {
    items = [new Item("Conjured Mana Cake", 3, 6)];
    update_quality();
    expect(items[0].quality).toEqual(4);
  });
});
