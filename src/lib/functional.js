export const chunk = (arr, func) =>
	Object.values(
		arr.reduce((acc, val) => {
			const key = func(val);
			acc[key] = [...(acc[key] || []), val];
			return acc;
		}, {}),
	);

export const bucket = (arr, func) =>
	arr.reduce((acc, val) => {
		const key = func(val);
		acc[key] = [...(acc[key] || []), val];
		return acc;
	}, {});

// de deplicate sorted array (`f` returns true if they are different)
export const dedup = (f) => (arr) =>
	arr.reduce((acc, val, idx) => {
		if (idx + 1 === arr.length || f(val, arr[idx + 1])) {
			acc.push(arr[idx] || {});
		}
		return acc;
	}, []);

export const find = (f) => (functor) => functor.find(f);
export const map = (f) => (functor) => functor.map(f);
export const filter = (f) => (functor) => functor.filter(f);
export const concat = (f) => (functor) => functor.concat(f);
export const flatMap = (f) => (functor) => functor.flatMap(f);
export const join = (f) => (functor) => functor.join(f);
export const every = (f) => (functor) => functor.every(f);
export const some = (f) => (functor) => functor.some(f);
export const includes = (f) => (functor) => functor.includes(f);
export const forEach = (f) => (functor) => functor.forEach(f);
export const reduce = (f) => (functor) => functor.reduce(f);
export const sort = (f) => (functor) => [...functor].sort(f);

export const pipe = (x0, ...funcs) => funcs.reduce((x, f) => f(x), x0);
