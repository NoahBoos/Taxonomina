import {registerDefinitionIPCHandlers} from "./DefinitionIPCHandlers";
import {registerDictionaryIPCHandlers} from "./DictionaryIPCHandlers";
import {registerEntryIPCHandlers} from "./EntryIPCHandlers";
import {registerGrammaticalClassIPCHandlers} from "./GrammaticalClassIPCHandlers";
import {registerGrammaticalGenreIPCHandlers} from "./GrammaticalGenreIPCHandlers";
import {registerLanguageIPCHandlers} from "./LanguageIPCHandlers";
import {registerSettingsIPCHandlers} from "./SettingsIPCHandlers";
import {registerDatabaseIPCHandlers} from "./DatabaseIPCHandlers";

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