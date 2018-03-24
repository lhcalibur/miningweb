import Rx from 'rxjs/Rx';
import KwMiningReducer$ from "./kwMiningReducer";

const reducer$ = Rx.Observable.merge(
  KwMiningReducer$.map(reducer => ["kwMining", reducer]),
);

export default reducer$;