# Lab 1 — Peer Review Record

**Author:** Natthakamol Mornparn — 67070505215 — GitHub: @natthakamol1130
**Peer reviewer:** Chanya — 6707051058 — GitHub: @chanya06

## Pull Requests I authored (reviewed by my partner)
| PR | Branch | Reviewer verdict |
|----|--------|------------------|
| #5 | feature/1-project-foundation | Approved |
| #6 | feature/2-health-check | Approved |
| #7 | feature/3-category-seed | Approved |
| #8 | feature/4-category-list | Approved |

Reviewer comment I received:
> โดยรวมทำได้ค่อนข้างครบตาม requirement ทั้ง API, การดึง category มาแสดงใน UI และมีการรองรับ Loading กับ Error state ด้วย แนะนำเพิ่มเติมว่าอาจลองทดสอบกรณี API ตอบข้อมูลว่าง หรือไม่มี category เพื่อดูว่า UI จะแสดงผลอย่างไร จะช่วยให้รองรับ edge case ได้ครบขึ้น

How I responded:
> ขอบคุณสำหรับคำแนะนำ ได้อัปเดตไฟล์ `client/src/App.tsx` ให้รองรับกรณี categories เป็นลิสต์ว่าง โดยแสดงผลข้อความ 'No categories found.' พร้อมเพิ่ม Unit Test ตรวจสอบ Edge case นี้ใน `App.test.tsx` และ push ขึ้น GitHub เรียบร้อยแล้ว

## Pull Requests I reviewed for my partner
My comment:
> ตรวจสอบโค้ดและเอกสารใน PR (Issue 4) ทั้งหมดแล้วครับ พัฒนาได้สมบูรณ์แบบมาก Endpoint `GET /api/categories` ดึงข้อมูลและเรียงตาม id ถูกต้อง, หน้าจอ React UI และ Unit Tests ครอบคลุมทั้ง Online, Offline และ Loading, บันทึกผลเทสต์ใน `tests.md` และ Prompts ใน `ai_use.md` ได้ละเอียดครบถ้วน Approved!

Partner's response:
> ขอบคุณสำหรับ Review และคำแนะนำครับ ได้ตรวจสอบผลการรันเทสต์และเตรียม Merge เข้า lab1-staging เรียบร้อยครับ
