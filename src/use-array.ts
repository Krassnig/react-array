import React, { useState } from "react";

const useRerender = (): (() => void) => {
	const [_, setNumber] = useState<number>(0);
	return () => setNumber(s => s + 1);
}

class ReactArray<T> extends Array<T> {
	public constructor(rerender: () => void, ...init: Array<T>) {
		super(...(init.length === 1 ? [] : init));
		if (init.length === 1) super.push(init[0]);
		Object.setPrototypeOf(this, ReactArray.prototype);
		this.rerender = rerender;
	}

	private rerender: () => void;

	public setLength(value: number): number {
		this.rerender();
		return this.length = value;
	}

	public clear(): void {
		this.rerender();
		this.length = 0;
	}

	public copyWithin(target: number, start: number, end?: number | undefined): this {
		this.rerender();
		super.copyWithin(target, start, end);
		return this;
	}

	public fill(value: T, start?: number | undefined, end?: number | undefined): this {
		this.rerender();
		super.fill(value, start, end);
		return this;
	}

	public pop(): T | undefined {
		this.rerender();
		return super.pop();
	}

	public push(...items: T[]): number {
		this.rerender();
		return super.push(...items);
	}

	public reverse(): T[] {
		this.rerender();
		return super.reverse();
	}

	public shift(): T | undefined {
		this.rerender();
		return super.shift();
	}

	public sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
		this.rerender();
		super.sort(compareFn);
		return this;
	}

	public splice(start: number, deleteCount?: number, ...items: T[]): T[] {
		this.rerender();
		return deleteCount === undefined ? super.splice(start, deleteCount) : super.splice(start, deleteCount, ...items);
	}

	public unshift(...items: T[]): number {
		this.rerender();
		return super.unshift(...items);
	}
}

const useArray = <T>(init?: Array<T> | (() => Array<T>)): [ReactArray<T>, React.Dispatch<React.SetStateAction<Array<T>>>] => {
	const rerender = useRerender();

	const [array, setArray] = useState<ReactArray<T>>(
		() => new ReactArray<T>(rerender, ...(init === undefined ? [] : (typeof init === 'function' ? init() : init)))
	);

	return [array,
		(newArray: React.SetStateAction<Array<T>>): void => 
			setArray((prevArray: ReactArray<T>): ReactArray<T> => new ReactArray(rerender, ...(typeof newArray === 'function' ? newArray(prevArray) : newArray)))
	];
}

export default useArray;