describe("Gilded Rose", function() {

  // Test 1: Basic item name check
  it("should keep the item name as 'foo'", function() {
    // Use createItem and pass the array to update_quality
    const testItems = [createItem("foo", 0, 0)];
    update_quality(testItems); // Pass the array
    expect(testItems[0].name).toEqual("foo");
  });

  // Test 2: Check for 'sell_in' property existence (this test is largely unchanged as it tests the constructor)
  it("should ensure every item has a 'sell_in' property", function() {
    // This test primarily checks the Item constructor/factory, so it doesn't need update_quality()
    const newItem = createItem("Test Item", 5, 10);
    expect(newItem.sell_in).toBeDefined();
    expect(typeof newItem.sell_in).toEqual('number');
  });

  // Test 3: Check for 'quality' property existence (similar to sell_in)
  it("should ensure every item has a 'quality' property", function() {
    const newItem = createItem("Test Item2", 5, 10);
    expect(newItem.quality).toBeDefined();
    expect(typeof newItem.quality).toEqual('number');
  });

  // Test 4: Decrease quality for a regular item
  it("should decrease the quality and sell_in each day for a regular item", function() {
    const testItems = [createItem("foo2", 10, 10)];
    update_quality(testItems); // Pass the array
    expect(testItems[0].quality).toEqual(9);
    expect(testItems[0].sell_in).toEqual(9); // Also assert sell_in decrease
  });

  // Test 5: Decrease quality twice as fast after sell by date
  it("should decrease the quality each day after sell by date twice as fast", function() {
    const testItems = [createItem("foo2", 0, 10)];
    update_quality(testItems); // Pass the array
    // Original quality 10. Normal decrease by 1, then extra decrease by 1 because sell_in < 0
    expect(testItems[0].quality).toEqual(8);
  });

  // Test 6: Prevent negative quality
  it("should prevent negative quality for a regular item", function() {
    const testItems = [createItem("foo2", 0, 0)];
    update_quality(testItems); // Pass the array
    expect(testItems[0].quality).toEqual(0);
  });

  // Test 7: Increase quality of 'Aged Brie'
  it("should increase quality of 'Aged Brie' the older it gets", function() {
    const testItems = [createItem("Aged Brie", 2, 10)];
    update_quality(testItems); // Pass the array
    expect(testItems[0].quality).toEqual(11);
  });

  // Test 8: Quality never over 50
  it("should never have an item with quality over 50 (for non-Sulfuras)", function() {
    // Test direct initialization above 50
    let testItems = [createItem("foo2", 10, 55)];
    update_quality(testItems);
    expect(testItems[0].quality).toEqual(50); // Should be capped

    // Test Aged Brie increasing to 50
    testItems = [createItem("Aged Brie", 2, 49)];
    update_quality(testItems); // Quality goes from 49 to 50
    expect(testItems[0].quality).toEqual(50);

    testItems = [createItem("Aged Brie", 2, 50)];
    update_quality(testItems); // Quality should stay at 50
    expect(testItems[0].quality).toEqual(50);
  });

  // Test 9: Sulfuras quality never decreases
  it("should never decrease the quality of Sulfuras", function() {
    const testItems = [createItem("Sulfuras, Hand of Ragnaros", 0, 80)];
    update_quality(testItems); // Pass the array
    expect(testItems[0].quality).toEqual(80);
    expect(testItems[0].sell_in).toEqual(0); // Sulfuras sell_in also doesn't change
  });

  // Test 10: Backstage passes quality logic
  it("should increase quality of concert tickets as date approaches and loose all value with concert", function() {
    // Note: It's better to test specific sell_in ranges rather than looping.
    // However, adapting your current loop-based test.
    let testItems = [createItem("Backstage passes to a TAFKAL80ETC concert", 15, 20)];

    // 15 days: +1 quality per day
    for(let i = 0; i < 5; i++) { // From sell_in 15 down to 10
        update_quality(testItems);
    }
    // Initial 20 + (5 days * +1) = 25. SellIn is now 10
    expect(testItems[0].quality).toEqual(25);
    expect(testItems[0].sell_in).toEqual(10);

    // 10 days: +2 quality per day
    for(let i = 0; i < 5; i++) { // From sell_in 10 down to 5
        update_quality(testItems);
    }
    // Current 25 + (5 days * +2) = 35. SellIn is now 5
    expect(testItems[0].quality).toEqual(35);
    expect(testItems[0].sell_in).toEqual(5);

    // 5 days: +3 quality per day, and capping at 50
    for(let i = 0; i < 5; i++) { // From sell_in 5 down to 0
        update_quality(testItems);
    }
    // Current 35 + (5 days * +3) = 50 (capped). SellIn is now 0
    expect(testItems[0].quality).toEqual(50); // Should be capped at 50
    expect(testItems[0].sell_in).toEqual(0);

    // After concert: quality drops to 0
    update_quality(testItems); // sell_in becomes -1
    expect(testItems[0].quality).toEqual(0);
    expect(testItems[0].sell_in).toEqual(-1);
  });

  // Test 11: Conjured items degrade twice as fast
  it("should decrease the quality of conjured items twice as fast", function() {
    const testItems = [createItem("Conjured Mana Cake", 3, 6)];
    update_quality(testItems); // Pass the array
    expect(testItems[0].quality).toEqual(4); // 6 - 2 = 4
    expect(testItems[0].sell_in).toEqual(2); // Regular sell_in decrease
  });

  it("should decrease the quality of conjured items twice as fast past sell_in", function() {
    const testItems = [createItem("Conjured Mana Cake", 0, 6)]; // SellIn 0
    update_quality(testItems);
    expect(testItems[0].quality).toEqual(2); // 6 - (2*2) = 2
    expect(testItems[0].sell_in).toEqual(-1);
  });
});