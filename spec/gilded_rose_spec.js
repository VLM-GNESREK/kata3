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
});
