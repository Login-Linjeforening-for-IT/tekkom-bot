import logStack from "./logStack.ts"
import requestWithRetries from "./requestWithEntries.ts"
import dotenv from "dotenv"

type ModifyPageProps = {
    existingHTML: string
    path: Path
    isStyret: boolean
}

type UpdateMutationProps = {
    id: number
    content: string
    description: string
    title: string
}

type UpdateIndexProps = {
    path: Path
    query: string
    isStyret: boolean
}

type Path = {
    currentPath: string
    nextPath: string
    date: string
}

dotenv.config()

const { TEKKOM_MEETINGS_URL, STYRET_MEETINGS_URL } = process.env

if (!TEKKOM_MEETINGS_URL || !STYRET_MEETINGS_URL ) {
    throw new Error('Missing essential environment variables in wiki.ts')
}

// Mutation to update the page content
function updateMutation({id, content, description, title}: UpdateMutationProps) {
    return (
        `
            mutation Page {
                pages {
                    update (
                        id: ${id}, 
                        content: """${content}""", 
                        description: "${description}", 
                        title: "${title}", 
                        editor: "code", 
                        isPublished: true, 
                        isPrivate: false, 
                        locale: "en", 
                        tags: "TekKom"
                    ) {
                        responseResult {
                            succeeded,
                            errorCode,
                            slug,
                            message
                        },
                        page {
                            id,
                            content,
                            description,
                            title
                        }
                    }
                }
            }
        `
    )
}

// Function to update the page content
function modifyPage({existingHTML, path, isStyret}: ModifyPageProps) {
    const paths = [TEKKOM_MEETINGS_URL, STYRET_MEETINGS_URL]
    const newEntry = `- [${path.nextPath}${isStyret ? ' - Styremøte' : ''}](${paths[isStyret ? 1 : 0]}${path.nextPath})`

    // Regex for both styret and tekkom formats
    const styretRegex = /(- \[\d{4}-\d+ - Styremøte\]\(\/public\/docs\/minutes\/styremoter\/\d{4}-\d+\))/
    const tekkomRegex = /(- \[\d{4}-\d+\]\(\/tekkom\/meetings\/\d{4}-\d+\))/

    // Choose the appropriate regex based on isStyret
    const regex = isStyret ? styretRegex : tekkomRegex

    // Checks if the entry already exists
    if (existingHTML.includes(newEntry)) {
        return existingHTML
    }

    // Finds the first match to insert the new entry before it
    const firstMatch = existingHTML.match(regex)
    if (firstMatch) {
        const insertIndex = firstMatch.index
        const updatedHTML = `${existingHTML.slice(0, insertIndex)}${newEntry}\n${existingHTML.slice(insertIndex)}`
        return updatedHTML
    }

    // Determines the section header to insert into
    const styretString = '### Styremøter'
    const tekkomString = '### Minutes'
    const insertionPoint = existingHTML.indexOf(isStyret ? styretString : tekkomString)
    
    // Calculates the index to insert the new entry
    const index = insertionPoint + (isStyret ? styretString.length : tekkomString.length)
    
    // If no match is found, inserts at the start of the correct section
    const updatedHTML = `${existingHTML.slice(0, index)}\n${newEntry}${existingHTML.slice(index)}`
    return updatedHTML
}

// Fetches the page, adds the new document, and writes it back
export default async function updateIndex({path, query, isStyret}: UpdateIndexProps) {
    try {
        const fetchResponse = await requestWithRetries({ query })
        const content = fetchResponse.data.pages.single.content
        const updatedContent = modifyPage({existingHTML: content, path, isStyret: content.includes('styremoter')})
        const TekKomTitle = 'Meetings'  
        const TekKomDescription = isStyret
            ? 'Styretmøte referater. Denne siden er automatisert. Endre med forsiktighet for å unngå å ødelegge automatisjonen. Rapporter feil til Styret.'
            : 'TekKom meeting agendas and minutes. This page is automatically managed. Please edit with care. Report errors to TekKom.'
        const updateResponse = await requestWithRetries({query: updateMutation({ 
            id: isStyret ? 7 : 37, 
            content: updatedContent, 
            description: TekKomDescription, 
            title: TekKomTitle
        })})

        if (updateResponse) {
            console.log(`${isStyret ? 'Styret' : 'TekKom'} index file updated successfully.`)
        }
    } catch (error) {
        console.log(`Failed to update ${isStyret ? 'styret' : 'TekKom'} index file:\n${error}`)
        logStack(error)
    }
}
