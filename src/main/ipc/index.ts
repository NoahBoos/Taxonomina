import {registerDefinitionIPCHandlers} from "./definitionIPCHandlers";
import {registerDictionaryIPCHandlers} from "./dictionaryIPCHandlers";
import {registerEntryIPCHandlers} from "./entryIPCHandlers";
import {registerGrammaticalClassIPCHandlers} from "./grammaticalClassIPCHandlers";
import {registerGrammaticalGenreIPCHandlers} from "./grammaticalGenreIPCHandlers";
import {registerLanguageIPCHandlers} from "./languageIPCHandlers";
import {registerSettingsIPCHandlers} from "./settingsIPCHandlers";
import {registerDatabaseIPCHandlers} from "./databaseIPCHandlers";

export function registerAllIPCHandlers() {
    registerDatabaseIPCHandlers();
    registerDefinitionIPCHandlers();
    registerDictionaryIPCHandlers();
    registerEntryIPCHandlers();
    registerGrammaticalClassIPCHandlers();
    registerGrammaticalGenreIPCHandlers();
    registerLanguageIPCHandlers();
    registerSettingsIPCHandlers();
}