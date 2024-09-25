export default function getID(command: string): string | undefined {
    if (!command) return undefined

    switch (command) {
        case 'create_ticket2':
        case 'create2':
        case 'ticket2':      return 'create_ticket2'
        case 'view':        return 'view_ticket'
        case 'tagticket':   return 'tag_ticket'
        case 'close':       return 'close_ticket'
        case 'reopen':      return 'reopen_ticket'
        case 'add':         return 'add'
        case 'addviewer':   return 'addviewer'
        case 'remove':      return 'remove'
        case 'invite':      return 'invite'
    }

    console.error(`Command ${command} is unmapped in getID.`)
    return `${command} is unmapped in getID.`
}
