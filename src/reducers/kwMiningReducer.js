import Rx from 'rxjs/Rx';
import {AjaxObservable} from "rxjs/observable/dom/AjaxObservable";
import queryString from "query-string";
import kwMiningActions from '../actions/kwMiningActions';

const initialState = {res: [], searchQuery: '', err: [], loading: false};

const searchInput$ = kwMiningActions.searchInput
  .pluck('target', 'value');

const throttledSearchInput$ = searchInput$
  .debounceTime(1000);

const searchClick$ = kwMiningActions.searchClick
  .withLatestFrom(searchInput$, (_, v) => v);

searchClick$.forEach(q => console.log(q));

const filteredQuery$ = kwMiningActions.search
  .filter(path => path)
  .flatMap(
    path => Rx.Observable.of(queryString.parse(path))
      .map(parsed => JSON.parse(parsed.q))
      .catch(err => {console.debug(err); return Rx.Observable.empty})
  )
  .merge(
    throttledSearchInput$.map(queryString => ({q: queryString})),
    searchClick$.map(queryString => ({q: queryString}))
  )
  .filter(q => typeof(q)==="object" && q != null && "q" in q && q.q && q.q !== '')
  .map(q => {
    if (!("f" in q)) {
      q = {...q, f: 0}
    }
    if (!("s" in q)) {
      q = {...q, s: 200}
    }
    return q
  })
  .distinctUntilChanged((p, q) => JSON.stringify(p) === JSON.stringify(q));

filteredQuery$.forEach(q => console.log(q));

const searchResponse$ = filteredQuery$
  .exhaustMap(q =>
    AjaxObservable.create({url: '/mining/api/keyword/search?' + queryString.stringify(q), crossDomain: true})
      .map(res => state => {
        console.log(res.response.results);
        return {...state, 'res': res.response.results || []}})
      .catch(error => Rx.Observable.of(state => {console.debug(error); return {...state, 'err': [error, ...state['err']]}}))
      .takeUntil(kwMiningActions.cancelSearch)
  );

const searchLoading$ = Rx.Observable.merge(
  filteredQuery$.mapTo('loading'),
  searchResponse$.mapTo('loaded')
).map(a => state => ({...state, 'loading': a === 'loading'}));

const KwMiningReducer$ = Rx.Observable.of(() => initialState)
  .merge(
    searchResponse$,
    filteredQuery$
      .pluck('q')
      .map(q => state => ({...state, 'searchQuery': q})),
    searchLoading$
  );

export default KwMiningReducer$