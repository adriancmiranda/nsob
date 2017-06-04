import ava from 'ava-spec';
import strategies from '../source/strategies';

ava('strategy', t => {
  t.is(toString.call(strategies.dotDefault), '[object Function]');
  t.is(toString.call(strategies.assignDefault), '[object Function]');
});
