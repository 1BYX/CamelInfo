import React from 'react'

const setWithExpiry = (key: string, value: string, ttl: string) => {
    const now = new Date()

    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
}