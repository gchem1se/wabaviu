CREATE TABLE message (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_row_id INTEGER NOT NULL,
    from_me INTEGER NOT NULL,
    key_id TEXT NOT NULL,
    sender_jid_row_id INTEGER,
    status INTEGER,
    broadcast INTEGER,
    recipient_count INTEGER,
    participant_hash TEXT,
    origination_flags INTEGER,
    origin INTEGER,
    timestamp INTEGER,
    received_timestamp INTEGER,
    receipt_server_timestamp INTEGER,
    message_type INTEGER,
    text_data TEXT,
    starred INTEGER,
    lookup_tables INTEGER,
    sort_id INTEGER NOT NULL DEFAULT 0,
    message_add_on_flags INTEGER
);

CREATE VIEW chat_view AS
SELECT
    chat._id AS _id,
    jid.raw_string AS raw_string_jid,
    hidden AS hidden,
    subject AS subject,
    created_timestamp AS created_timestamp,
    display_message_row_id AS display_message_row_id,
    last_message_row_id AS last_message_row_id,
    last_read_message_row_id AS last_read_message_row_id,
    last_read_receipt_sent_message_row_id AS last_read_receipt_sent_message_row_id,
    last_important_message_row_id AS last_important_message_row_id,
    archived AS archived,
    sort_timestamp AS sort_timestamp,
    mod_tag AS mod_tag,
    gen AS gen,
    spam_detection AS spam_detection,
    unseen_earliest_message_received_time AS unseen_earliest_message_received_time,
    unseen_message_count AS unseen_message_count,
    unseen_missed_calls_count AS unseen_missed_calls_count,
    unseen_row_count AS unseen_row_count,
    unseen_message_reaction_count AS unseen_message_reaction_count,
    last_message_reaction_row_id AS last_message_reaction_row_id,
    last_seen_message_reaction_row_id AS last_seen_message_reaction_row_id,
    plaintext_disabled AS plaintext_disabled,
    vcard_ui_dismissed AS vcard_ui_dismissed,
    change_number_notified_message_row_id AS change_number_notified_message_row_id,
    show_group_description AS show_group_description,
    ephemeral_expiration AS ephemeral_expiration,
    last_read_ephemeral_message_row_id AS last_read_ephemeral_message_row_id,
    ephemeral_setting_timestamp AS ephemeral_setting_timestamp,
    ephemeral_disappearing_messages_initiator AS ephemeral_disappearing_messages_initiator,
    unseen_important_message_count AS unseen_important_message_count,
    group_type AS group_type,
    growth_lock_level AS growth_lock_level,
    growth_lock_expiration_ts AS growth_lock_expiration_ts,
    last_read_message_sort_id AS last_read_message_sort_id,
    display_message_sort_id AS display_message_sort_id,
    last_message_sort_id AS last_message_sort_id,
    last_read_receipt_sent_message_sort_id AS last_read_receipt_sent_message_sort_id,
    has_new_community_admin_dialog_been_acknowledged AS has_new_community_admin_dialog_been_acknowledged,
    history_sync_progress AS history_sync_progress
FROM
    chat chat
    LEFT JOIN jid jid ON chat.jid_row_id = jid._id;

CREATE TABLE message_media (
    message_row_id INTEGER PRIMARY KEY,
    chat_row_id INTEGER,
    autotransfer_retry_enabled INTEGER,
    multicast_id TEXT,
    media_job_uuid TEXT,
    transferred INTEGER,
    transcoded INTEGER,
    file_path TEXT,
    file_size INTEGER,
    suspicious_content INTEGER,
    trim_from INTEGER,
    trim_to INTEGER,
    face_x INTEGER,
    face_y INTEGER,
    media_key BLOB,
    media_key_timestamp INTEGER,
    width INTEGER,
    height INTEGER,
    has_streaming_sidecar INTEGER,
    gif_attribution INTEGER,
    thumbnail_height_width_ratio REAL,
    direct_path TEXT,
    first_scan_sidecar BLOB,
    first_scan_length INTEGER,
    message_url TEXT,
    mime_type TEXT,
    file_length INTEGER,
    media_name TEXT,
    file_hash TEXT,
    media_duration INTEGER,
    page_count INTEGER,
    enc_file_hash TEXT,
    partial_media_hash TEXT,
    partial_media_enc_hash TEXT,
    is_animated_sticker INTEGER,
    original_file_hash TEXT,
    mute_video INTEGER DEFAULT 0,
    media_caption TEXT
);

CREATE VIEW easier_contacts_view AS
SELECT
    jid,
    (
        SELECT
            CASE
                WHEN MIN(display_name) IS NULL THEN "+" || SUBSTR(jid, 1, INSTR(jid, "@") - 1)
                ELSE MIN(DISPLAY_NAME)
            END
    ) display_name,
    (
        SELECT
            CASE
                WHEN jid LIKE "%g.us" THEN 1
                ELSE 0
            END
    ) is_group,
    (
        SELECT
            conversation_message_count
        FROM
            wa_contact_storage_usage wacsu2
        WHERE
            wacsu2.jid = wa_contacts.jid
    ) messages_count
FROM
    wa_contacts
WHERE
    EXISTS (
        SELECT
            1
        FROM
            wa_contact_storage_usage wacsu
        where
            wacsu.jid = wa_contacts.jid
    )
GROUP BY
    jid;

CREATE VIEW easier_messages_view AS
SELECT
    message._id message_row_id,
    key_id message_key_id,
    chat_view.raw_string_jid jid,
    text_data,
    from_me,
    timestamp,
    CASE
        WHEN message.message_type = 0 THEN "text"
        WHEN message.message_type = 1 THEN "image"
        WHEN message.message_type = 2 THEN "voice_note"
        WHEN message.message_type = 3 THEN "video"
        WHEN message.message_type = 4 THEN "contact"
        WHEN message.message_type = 5 THEN "location"
        WHEN message.message_type = 9 THEN "document"
        WHEN message.message_type = 13 THEN "gif"
        WHEN message.message_type = 15 THEN "voice_note"
        WHEN message.message_type = 15 THEN "voice_note"
        WHEN message.message_type = 42 THEN "view_once_image"
        WHEN message.message_type = 43 THEN "view_once_video"
        WHEN message.message_type = 66 THEN "poll"
        ELSE "unknown: " + CAST(message.message_type AS TEXT)
    END message_type
FROM
    message
    LEFT JOIN chat_view ON chat_view._id = message.chat_row_id;