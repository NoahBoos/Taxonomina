<script lang="ts">
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";
    import { Lock, LockOpen } from "@lucide/svelte";
    import { lockedFieldValuesStore } from "@/renderer/stores/lockedFieldValuesStore";
    import IconButton from "@/renderer/components/ui/interactive/IconButton.svelte";

    interface Props {
        name: string;
        label: string;
        checked?: boolean;
        disabled?: boolean;
        onChange?: (...args: any[]) => void;
        variant?: 'default' | 'minimal';
        is_lockable?: boolean;
        errors?: TaxonominaError<ErrorDomain>[];
    }

    let { name, label, checked = $bindable(false), disabled = $bindable(false), onChange, variant = 'default', is_lockable = false, errors = [] }: Props = $props();
    let id = crypto.randomUUID();

    let is_locked = $state(false);

    function toggleLock() {
        if (is_locked) {
            delete $lockedFieldValuesStore[name];
            is_locked = false;
        } else {
            $lockedFieldValuesStore[name] = checked;
            is_locked = true;
        }
    }

    $effect(() => {
        if (!is_lockable) return;

        if (name in $lockedFieldValuesStore) {
            checked = $lockedFieldValuesStore[name];
            is_locked = true;
        }
    });
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply m-0 border-2 bg-base-10 transform scale-100;
    }

    input:hover {
        @apply border-accent-500 bg-base-20;
    }
</style>

<div class="{ variant === 'default' ? 'form-field-container' : '' } flex flex-row items-center gap-2 { variant === 'default' && errors.length > 0 ? 'form-field-container--errors' : '' }">
    <input type="checkbox" { id } { name } bind:checked={ checked } onchange={ onChange } disabled={ disabled || is_locked } />
    <label for={ id } class="flex-1">{ label }</label>
    {#if is_lockable}
        <IconButton icon={ is_locked ? LockOpen : Lock } onClick={ toggleLock } />
    {/if}
</div>