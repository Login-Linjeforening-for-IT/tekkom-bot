import run from '#db'

export default async function checkBtg() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    await run(`DELETE FROM btg WHERE timestamp < $1;`, [oneDayAgo])
}
