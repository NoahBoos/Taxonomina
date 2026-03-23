import {registerDefinitionIPCHandlers} from "./definitionIPCHandlers";
import {registerDictionaryIPCHandlers} from "./dictionaryIPCHandlers";
import {registerEntryIPCHandlers} from "./entryIPCHandlers";
import {registerGrammaticalClassIPCHandlers} from "./grammaticalClassIPCHandlers";
import {registerGrammaticalGenreIPCHandlers} from "./grammaticalGenreIPCHandlers";
import {registerLanguageIPCHandlers} from "./languageIPCHandlers";
import {registerSettingsIPCHandlers} from "./settingsIPCHandlers";
import {registerDatabaseIPCHandlers} from "./databaseIPCHandlers";
import { registerCategoryIPCHandlers } from "./categoryIPCHandlers";

export function registerAllIPCHandlers() {
    registerDatabaseIPCHandlers();
    registerCategoryIPCHandlers();
    registerDefinitionIPCHandlers();
    registerDictionaryIPCHandlers();
    registerEntryIPCHandlers();
    registerGrammaticalClassIPCHandlers();
    registerGrammaticalGenreIPCHandlers();
    registerLanguageIPCHandlers();
    registerSettingsIPCHandlers();
}