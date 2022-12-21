export const chunk = (arr, func) =>
	Object.values(
		arr.reduce((acc, val) => {
			const key = func(val);
			acc[key] = [...(acc[key] || []), val];
			return acc;
		}, {}),
	);

export const group = (arr, func) =>
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

export const pipe = (x0, ...funcs) => funcs.reduce((x, f) => f(x), x0);

export const at = (f) => (functor) => functor.at(f);
export const concat = (f) => (functor) => functor.concat(f);
export const copyWithin = (f) => (functor) => functor.copyWithin(f);
export const entries = (f) => (functor) => functor.entries(f);
export const every = (f) => (functor) => functor.every(f);
export const fill = (f) => (functor) => functor.fill(f);
export const filter = (f) => (functor) => functor.filter(f);
export const find = (f) => (functor) => functor.find(f);
export const findIndex = (f) => (functor) => functor.findIndex(f);
export const findLast = (f) => (functor) => functor.findLast(f);
export const findLastIndex = (f) => (functor) => functor.findLastIndex(f);
export const flat = (f) => (functor) => functor.flat(f);
export const flatMap = (f) => (functor) => functor.flatMap(f);
export const forEach = (f) => (functor) => functor.forEach(f);
// export const group = (f) => (functor) => functor.group(f);
// export const groupToMap = (f) => (functor) => functor.groupToMap(f);
export const includes = (f) => (functor) => functor.includes(f);
export const indexOf = (f) => (functor) => functor.indexOf(f);
export const join = (f) => (functor) => functor.join(f);
export const keys = (f) => (functor) => functor.keys(f);
export const lastIndexOf = (f) => (functor) => functor.lastIndexOf(f);
export const map = (f) => (functor) => functor.map(f);
export const pop = (f) => (functor) => functor.pop(f);
export const push = (f) => (functor) => functor.push(f);
export const reduce = (f) => (functor) => functor.reduce(f);
export const reduceRight = (f) => (functor) => functor.reduceRight(f);
export const reverse = (f) => (functor) => functor.reverse(f);
export const shift = (f) => (functor) => functor.shift(f);
export const slice = (f) => (functor) => functor.slice(f);
export const some = (f) => (functor) => functor.some(f);
export const sort = (f) => (functor) => functor.sort(f);
export const splice = (f) => (functor) => functor.splice(f);
export const toLocaleString = (f) => (functor) => functor.toLocaleString(f);
export const toString = (f) => (functor) => functor.toString(f);
export const unshift = (f) => (functor) => functor.unshift(f);
export const values = (f) => (functor) => functor.values(f);
