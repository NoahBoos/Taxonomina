<script lang="ts">
    interface Props {
        visible: boolean;
        children: any;
    }

    let { visible, children }: Props = $props();
</script>

<style>

</style>

{#if visible}
    <div>
        <ul>
            {@render children()}
        </ul>
    </div>
{/if}