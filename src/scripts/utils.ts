const getTimeFromTimestamp = (timestamp: number) : string => {
    const d = new Date(timestamp);
    return d.getHours().toString() + ":" + d.getMinutes().toString() 
}

export {getTimeFromTimestamp};