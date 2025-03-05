"use client"

export function SetKey(key:string, value:string): void {
    localStorage.setItem(key, value)
}

export function GetKey(key:string): string {
    return localStorage.getItem(key)
}

export function Clear(): void {
    localStorage.clear()
}

export function RemoveKey(key:string): void {
    localStorage.removeItem(key)
}

