import { TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import updateStyretTemplate from './updateStyretTemplate.ts'
import getQuery from './getQuery.ts'
import requestWithRetries from './requestWithEntries.ts'
import getNextPathYearAndWeek from './getNextPathYearAndWeek.ts'
import updateIndex from './updateIndexPage.ts'
import createPage from './createPage.ts'

dotenv.config()

const {
    TEKKOM_MEETINGS_URL,
    STYRET_MEETINGS_URL,
    DISCORD_TEKKOM_ROLE_ID,
    DISCORD_STYRET_ROLE_ID,
    WIKI_URL,
    WIKI_STYRET_TEMPLATE_ID,
    WIKI_TEKKOM_TEMPLATE_ID,
} = process.env

if (
    !TEKKOM_MEETINGS_URL 
    || !DISCORD_TEKKOM_ROLE_ID 
    || !DISCORD_STYRET_ROLE_ID 
    || !STYRET_MEETINGS_URL 
    || !WIKI_URL
    || !WIKI_STYRET_TEMPLATE_ID
    || !WIKI_TEKKOM_TEMPLATE_ID
) {
    throw new Error('Missing essential environment variables in wiki.ts')
}

type AutoCreateProps = {
    channel: TextChannel
    isStyret: boolean
    styremote?: TextChannel
}

export default async function autoCreate({channel, isStyret, styremote}: AutoCreateProps) {
    const path = getNextPathYearAndWeek(isStyret)
    const styret_id = Number(WIKI_STYRET_TEMPLATE_ID)
    const tekkom_id = Number(WIKI_TEKKOM_TEMPLATE_ID)
    const query = getQuery(isStyret ? styret_id : tekkom_id)
    const fetchResponse = await requestWithRetries({ query })
    const content = fetchResponse.data.pages.single.content
    const filledTemplate = content
        .replace(new RegExp(`${path.currentPath}`, 'g'), path.nextPath)
        .replace('00.00.0000', path.date)
        .replace('00.00.00', path.date)
    const fullPath = `${isStyret ? STYRET_MEETINGS_URL : TEKKOM_MEETINGS_URL}${path.nextPath}` 
    const updatedTemplate = await updateStyretTemplate({ 
        channel, 
        isStyret, 
        template: filledTemplate, 
        week: path.nextPath.split('-')[1] 
    }) 
    if (!updatedTemplate) {
        return
    }

    const createResponse = await createPage({
        content: updatedTemplate, 
        description: isStyret 
            ? `Styremøte uke ${path.nextPath.slice(5)}` 
            : `TekKom Meeting Week ${path.nextPath.slice(5)}`, 
        path: fullPath, 
        title: path.nextPath
    })

    console.log(`Create response: ${createResponse}`)

    if (isStyret) {
        styremote?.send(`<@&${DISCORD_STYRET_ROLE_ID}> Minner om Styremøte på LL kl 17. [Agenda](${WIKI_URL}${STYRET_MEETINGS_URL}${path.nextPath}).`)
    } else {
        // Disabled, moved to Queenbee
        // channel.send(`<@&${DISCORD_TEKKOM_ROLE_ID}> Minner om TekKom møte på onsdag kl 16 på LL. [Agenda](${WIKI_URL}${TEKKOM_MEETINGS_URL}${path.nextPath}).`)
    }

    updateIndex({ path, query: getQuery(isStyret ? 7 : 37), isStyret })
}
