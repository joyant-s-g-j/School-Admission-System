using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolAdmission.Migrations
{
    /// <inheritdoc />
    public partial class AddDatabaseConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Holds_Classes_SchoolClassId",
                table: "Holds");

            migrationBuilder.DropIndex(
                name: "IX_Holds_SchoolClassId",
                table: "Holds");

            migrationBuilder.DropColumn(
                name: "SchoolClassId",
                table: "Holds");

            migrationBuilder.AlterColumn<string>(
                name: "StudentId",
                table: "Holds",
                type: "character varying(17)",
                maxLength: 17,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Holds",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Classes",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_Holds_StudentId",
                table: "Holds",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "UX_Holds_ActiveAdmission",
                table: "Holds",
                columns: new[] { "ClassId", "StudentId" },
                unique: true,
                filter: "\"Status\" IN ('HELD', 'CONFIRMED')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Holds_Status",
                table: "Holds",
                sql: "\"Status\" IN ('HELD', 'CONFIRMED', 'EXPIRED', 'CANCELLED')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_HOlds_StudentId",
                table: "Holds",
                sql: "\"StudentId\" ~ '^[0-9]{17}$'");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Classes_TotalSeats",
                table: "Classes",
                sql: "\"TotalSeats\" > 0");

            migrationBuilder.AddForeignKey(
                name: "FK_Holds_Classes_ClassId",
                table: "Holds",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Holds_Classes_ClassId",
                table: "Holds");

            migrationBuilder.DropIndex(
                name: "IX_Holds_StudentId",
                table: "Holds");

            migrationBuilder.DropIndex(
                name: "UX_Holds_ActiveAdmission",
                table: "Holds");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Holds_Status",
                table: "Holds");

            migrationBuilder.DropCheckConstraint(
                name: "CK_HOlds_StudentId",
                table: "Holds");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Classes_TotalSeats",
                table: "Classes");

            migrationBuilder.AlterColumn<string>(
                name: "StudentId",
                table: "Holds",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(17)",
                oldMaxLength: 17);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Holds",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.AddColumn<Guid>(
                name: "SchoolClassId",
                table: "Holds",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Classes",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateIndex(
                name: "IX_Holds_SchoolClassId",
                table: "Holds",
                column: "SchoolClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Holds_Classes_SchoolClassId",
                table: "Holds",
                column: "SchoolClassId",
                principalTable: "Classes",
                principalColumn: "Id");
        }
    }
}
