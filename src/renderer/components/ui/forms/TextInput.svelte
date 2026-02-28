<script lang="ts">
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";
    import { Lock, LockOpen } from "@lucide/svelte";
    import { lockedFieldValuesStore } from "@/renderer/stores/lockedFieldValuesStore";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";

    interface Props {
        name: string;
        label: string;
        placeholder: string;
        value?: string | number;
        is_lockable?: boolean;
        errors?: TaxonominaError<ErrorDomain>[];
    }

    let { name, label, placeholder, value = $bindable(''), is_lockable = false, errors = [] }: Props = $props();
    let id = crypto.randomUUID();

    let is_locked = $state(false);

    function toggleLock() {
        if (is_locked) {
            delete $lockedFieldValuesStore[name];
            is_locked = false;
        } else {
            $lockedFieldValuesStore[name] = value;
            is_locked = true;
        }
    }

    $effect(() => {
        if (!is_lockable) return;

        if (name in $lockedFieldValuesStore) {
            value = $lockedFieldValuesStore[name];
            is_locked = true;
        }
    });
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply px-2 py-1 border-2 rounded-lg border-base-40 bg-base-10 w-full transition-colors duration-250 ease-out;
    }

    input:hover {
        @apply border-accent-500 bg-base-20;
    }
</style>

<div class="form-field-container flex flex-col gap-2 { errors.length > 0 ? 'form-field-container--errors' : '' }">
    <div class="flex-1 flex flex-row justify-between items-center">
        <label for={ id }>{ label }</label>
        {#if is_lockable}
            <IconButton icon={ is_locked ? LockOpen : Lock } text={ is_locked ? 'Déverrouiller' : 'Verrouiller' } variant={ is_locked ? 'active' : 'default' } onClick={ toggleLock } />
        {/if}
    </div>
    <input type="text" { id } { name } { placeholder } bind:value={ value } readonly={ is_locked } />
    {#if errors.length > 0}
        <div>
            {#each errors as error}
                <p>{ error.code } : { error.message }</p>
            {/each}
        </div>
    {/if}
</div>