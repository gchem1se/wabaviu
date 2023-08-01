DROP INDEX IF EXISTS message_message_type;

DROP INDEX IF EXISTS message_chat_row_id;

DROP INDEX IF EXISTS message_sender_jid_row_id;

DROP INDEX IF EXISTS chat__id;

DROP INDEX IF EXISTS chat_jid_row_id;

DROP INDEX IF EXISTS chat_sort_timestamp;

DROP INDEX IF EXISTS jid__id;

DROP INDEX IF EXISTS jid_raw_string;

DROP INDEX IF EXISTS wa_contacts_jid;

DROP INDEX IF EXISTS wa_contacts_is_whatsapp_user;

DROP INDEX IF EXISTS wa_contact_storage_usage_jid;

CREATE INDEX message_message_type ON message (message_type);

CREATE INDEX message_chat_row_id ON message (chat_row_id);

CREATE INDEX message_sender_jid_row_id ON message (sender_jid_row_id);

CREATE INDEX chat__id ON chat (_id);

CREATE INDEX chat_jid_row_id ON chat (jid_row_id);

CREATE INDEX chat_sort_timestamp ON chat (sort_timestamp);

CREATE INDEX jid__id ON jid (_id);

CREATE INDEX jid_raw_string ON jid (raw_string);

CREATE INDEX wa_contacts_jid ON wa_contacts (jid);

CREATE INDEX wa_contacts_is_whatsapp_user ON wa_contacts (is_whatsapp_user);

CREATE INDEX wa_contact_storage_usage_jid ON wa_contact_storage_usage (jid);

DROP VIEW IF EXISTS easier_contacts_view;

CREATE VIEW easier_contacts_view AS
SELECT
    CASE
        WHEN j.server = 'g.us' THEN 1
        ELSE 0
    END is_group,
    wacsu.conversation_message_count messages_count,
    max(j._id) id,
    j.raw_string jid_raw_string,
    coalesce(min(wc.display_name), 'unknown: ' || min(j.user)) contact_name,
    coalesce(max(c.sort_timestamp), -1) sort_field,
    coalesce(MAX(c.last_message_row_id), -1) last_message_id
FROM
    chat c
    RIGHT JOIN jid j ON j._id = c.jid_row_id
    LEFT JOIN wa_contacts wc ON wc.jid = j.raw_string
    LEFT JOIN wa_contact_storage_usage wacsu ON wacsu.jid = wc.jid
GROUP BY
    j.raw_string,
    wacsu.conversation_message_count
ORDER BY
    sort_field DESC;

DROP VIEW IF EXISTS easier_messages_view;

CREATE VIEW easier_messages_view AS
SELECT
    m._id id,
    m.from_me,
    m.status,
    m.timestamp,
    m.text_data,
    jc.raw_string chat_jid_raw_string,
    js.raw_string sender_jid_raw_string,
    CASE
        WHEN jc.raw_string LIKE '%g.us' THEN 1
        ELSE 0
    END is_from_group, /* TODO: redundant, delete this field */
    CASE
        WHEN m.message_type = 0 THEN 'text'
        WHEN m.message_type = 1 THEN 'image'
        WHEN m.message_type = 2 THEN 'voice_note'
        WHEN m.message_type = 3 THEN 'video'
        WHEN m.message_type = 4 THEN 'contact'
        WHEN m.message_type = 5 THEN 'location'
        WHEN m.message_type = 9 THEN 'document'
        WHEN m.message_type = 13 THEN 'gif'
        WHEN m.message_type = 15 THEN 'voice_note'
        WHEN m.message_type = 42 THEN 'view_once_image'
        WHEN m.message_type = 43 THEN 'view_once_video'
        WHEN m.message_type = 66 THEN 'poll'
        ELSE 'unknown: ' || CAST(m.message_type AS TEXT)
    END message_type
FROM
    message m
    LEFT JOIN chat cc ON cc._id = m.chat_row_id
    LEFT JOIN jid jc ON jc._id = cc.jid_row_id
    LEFT JOIN jid js ON js._id = m.sender_jid_row_id;

SELECT
    m.id,
    m.message_type,
    m.from_me,
    m.status,
    m.timestamp,
    m.text_data,
    ecvc.contact_name chat_name,
    ecvc.is_group is_from_group,
    COALESCE(ecvs.contact_name, 'yourself') sender_name
FROM
    easier_messages_view m
    LEFT JOIN easier_contacts_view ecvc ON ecvc.jid_raw_string = m.chat_jid_raw_string
    LEFT JOIN easier_contacts_view ecvs ON ecvs.jid_raw_string = m.sender_jid_raw_string
WHERE
    chat_name = :from_who
LIMIT
    17
SELECT
    *
FROM
    easier_contacts_view
where
    messages_count > 0