let searchJS=require('./search');

test('validates searchbar', ()=>{
    expect(searchJS.validateSearchbar("")).toBe(true);
    expect(searchJS.validateSearchbar("rune")).toBe(true);
    expect(searchJS.validateSearchbar("rr")).toBe(true);
    expect(searchJS.validateSearchbar("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis nat")).toBe(true);
    
    expect(searchJS.validateSearchbar("r")).toBe(false);
    expect(searchJS.validateSearchbar("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis nata")).toBe(false);
})