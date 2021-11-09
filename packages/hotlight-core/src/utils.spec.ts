import { underscore } from "./utils";

describe('underscore', () => {
  it('undersores overlapping characters', () => {
    expect(underscore('hlowd', 'hello world')).toEqual('<span class="u">h</span>e<span class="u">l</span>l<span class="u">o</span> <span class="u">w</span>orl<span class="u">d</span>');
    expect(underscore('x', 'hello world')).toEqual('hello world');
    expect(underscore('H', 'hel')).toEqual('<span class="u">h</span>el');
    expect(underscore('hl', 'hell')).toEqual('<span class="u">h</span>e<span class="u">l</span>l');
    expect(underscore('svelte', 'hotlight and svelte')).toEqual('hotlight and <span class="u">s</span><span class="u">v</span><span class="u">e</span><span class="u">l</span><span class="u">t</span><span class="u">e</span>');
  });
});
