import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from "discord.js"
import handleTagTicket, { tagTicket } from "#utils/tickets/tag.ts"
import { handleCloseSelectedTicket, handleCloseTicket } from "#utils/tickets/close.ts"
import handleViewTicket from "#utils/tickets/view.ts"
import handleReopenTicket, { reopenTicket } from "#utils/tickets/reopen.ts"
import handleCreateTicket from "#utils/tickets/create.ts"
import addRoleToCreate from "#utils/tickets/roles.ts"
import manageUser from "#utils/tickets/users.ts"
import handleAddToTicket, { handleAddViewerToTicket } from "#utils/tickets/add.ts"
import manageRoles from "#utils/tickets/roles.ts"
import handleRemoveFromTicket from "#utils/tickets/remove.ts"
import { nextPage, previousPage } from "#utils/help.ts"
import { inviteToTicket, joinTicket } from "#utils/tickets/invite.ts"
import handleTag, { removeTag } from "#utils/gitlab/handleTag.ts"
import { Build, Increment } from "#interfaces"
import retryDeployment from "#utils/gitlab/retryDeployment.ts"
import trash from "#utils/trash.ts"
import deployHelper from "#utils/gitlab/deployHelper.ts"
import cancel from "#utils/gitlab/cancel.ts"
import releaseHelper from "#utils/gitlab/releaseHelper.ts"

export default async function handleComponents(interaction: ButtonInteraction | ChatInputCommandInteraction, id: string | undefined) {    
    const buttonInteraction = interaction as ButtonInteraction

    // id is present if interaction is ChatInputCommandInteraction
    switch (id || buttonInteraction.customId) {
        case 'create_ticket':
            await handleCreateTicket(buttonInteraction)
            break
        case 'view_ticket':
            await handleViewTicket(buttonInteraction)
            break
        case 'tag_ticket':
            await handleTagTicket(buttonInteraction)
            break
        case 'close_ticket':
            await handleCloseTicket(buttonInteraction)
            break
        case 'reopen_ticket':
            await handleReopenTicket(buttonInteraction)
            break
        case 'close_ticket_selected':
            await handleCloseSelectedTicket(buttonInteraction)
            break
        case 'add_tag_to_create':
        case 'add_tag_to_open_ticket':
            await tagTicket(buttonInteraction)
            break
        case 'add_role_to_create':
        case 'add_role_to_ticket':
            await addRoleToCreate(buttonInteraction)
            break
        case 'add_user_to_ticket':
        case 'add_user_to_create':
            await manageUser(buttonInteraction)
            break
        case 'remove_user_from_ticket':
            await manageUser(buttonInteraction, undefined, true)
            break
        case 'remove_role_from_ticket':
            await manageRoles(buttonInteraction, undefined, true)
            break
        case 'add':
            await handleAddToTicket(buttonInteraction)
            break
        case 'add_user_viewer_to_ticket':
            await manageUser(buttonInteraction, false)
            break
        case 'add_role_viewer_to_ticket':
            await addRoleToCreate(buttonInteraction, false)
            break
        case 'addviewer':
            await handleAddViewerToTicket(buttonInteraction)
            break
        case 'remove':
            await handleRemoveFromTicket(buttonInteraction)
            break
        case 'view_ticket_command':
            await reopenTicket(buttonInteraction, true)
            break
        case 'reopen_channel':
            await reopenTicket(buttonInteraction)
            break
        case 'next_page_help':
            await nextPage(buttonInteraction)
            break
        case 'previous_page_help':
            await previousPage(buttonInteraction)
            break
        case 'invite_to_ticket':
            await inviteToTicket(buttonInteraction)
            break
        case 'join_ticket':
            await joinTicket(buttonInteraction)
            break
        case 'major':
            await handleTag(buttonInteraction, Increment.MAJOR)
            break
        case 'minor':
            await handleTag(buttonInteraction, Increment.MINOR)
            break
        case 'patch':
            await handleTag(buttonInteraction, Increment.PATCH)
            break
        case 'error':
        case 'trash':
            trash(buttonInteraction)
            break
        case 'cancel':
            await removeTag(buttonInteraction)
            break
        case 'retryDeployment':
            await retryDeployment(buttonInteraction)
            break
        case 'deployYes':
            await deployHelper(buttonInteraction)
            break
        case 'deployNo':
            await cancel(buttonInteraction, Build.DEPLOYMENT)
            break
        case 'releaseYes':
            await releaseHelper(buttonInteraction)
            break
        case 'releaseNo':
            await cancel(buttonInteraction, Build.RELEASE)
            break
        default:
            console.log(`${buttonInteraction.customId || id} is unhandled in handleComponents.`)
            await buttonInteraction.reply({ content: `Unknown action. ${buttonInteraction.customId}`, flags: MessageFlags.Ephemeral })
            break
    }
}
