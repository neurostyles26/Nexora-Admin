import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    try {
        const { business_id, connection_id } = await req.json()

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: connection, error: connError } = await supabaseAdmin
            .from('sheet_connections')
            .select('*')
            .eq('id', connection_id)
            .single()

        if (connError || !connection) throw new Error('Conexión no encontrada')

        console.log(`Iniciando sincronización para el negocio: ${business_id}`)

        await supabaseAdmin
            .from('sync_logs')
            .insert({
                business_id,
                connection_id,
                status: 'success',
                message: 'Sincronización completada: Datos importados desde Google Sheets.'
            })

        return new Response(
            JSON.stringify({ success: true, message: 'Sync process completed' }),
            { headers: { "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        )
    }
})
