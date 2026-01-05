import {RegisterDefinitionIPCHandlers} from "./DefinitionIPCHandlers";
import {RegisterDictionaryIPCHandlers} from "./DictionaryIPCHandlers";
import {RegisterEntryIPCHandlers} from "./EntryIPCHandlers";
import {RegisterGrammaticalClassIPCHandlers} from "./GrammaticalClassIPCHandlers";
import {RegisterGrammaticalGenreIPCHandlers} from "./GrammaticalGenreIPCHandlers";
import {RegisterLanguageIPCHandlers} from "./LanguageIPCHandlers";
import {RegisterSettingsIPCHandlers} from "./SettingsIPCHandlers";
import {RegisterDatabaseIPCHandlers} from "./DatabaseIPCHandlers";

export function RegisterAllIPCHandlers() {
    RegisterDatabaseIPCHandlers();
    RegisterDefinitionIPCHandlers();
    RegisterDictionaryIPCHandlers();
    RegisterEntryIPCHandlers();
    RegisterGrammaticalClassIPCHandlers();
    RegisterGrammaticalGenreIPCHandlers();
    RegisterLanguageIPCHandlers();
    RegisterSettingsIPCHandlers();
}