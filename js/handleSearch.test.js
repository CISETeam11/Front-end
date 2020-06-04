
HttpClient=require('./network');
let searchJS=require('./search');

test('validates searchbar', ()=>{
    expect(searchJS.handleSearch("case")).toBeDefined();
    expect(searchJS.handleSearch("rune")).not.toBeNull();
})