import createItem from './createItem';
import deleteItem from './deleteItem';
import listItems from './listItems';
import { Item } from './Item';

type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        itemId: string,
        item: Item
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "createItem":
            return await createItem(event.arguments.item);
        case "deleteItem":
            return await deleteItem(event.arguments.item);
        case "listItems":
            return await listItems();
        default:
            return null;
    }
}