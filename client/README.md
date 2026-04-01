## issues fix

```JS
// Issue fix 1

attachTokenInterceptor adds a new interceptor every time it's called. If you're calling it inside a component or hook that re-renders, you'll end up with multiple interceptors stacking up, each calling getToken() — meaning one request could be waiting for multiple token fetches serially

getToken from Clerk has an unstable reference
— it may change on every render,

causing useEffect to run repeatedly,
briefly leaving a window where no interceptor is attached (ejected old, not yet attached new).

Any request fired in that gap goes out without a token.
Fix — stabilize with useCallback or use a ref:
```
