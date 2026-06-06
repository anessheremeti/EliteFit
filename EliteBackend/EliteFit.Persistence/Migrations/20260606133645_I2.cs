using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EliteFit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class I2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Badges_Files_BadgeIconId",
                table: "Badges");

            migrationBuilder.DropForeignKey(
                name: "FK_Files_users_UploaderId",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_RecipeAllergens_Recipes_RecipeId",
                table: "RecipeAllergens");

            migrationBuilder.DropForeignKey(
                name: "FK_RecipeAllergens_allergies_AllergyId",
                table: "RecipeAllergens");

            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_Files_ImageFileId",
                table: "Recipes");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_Roles_RoleId",
                table: "RolePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_users_UserId",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserStreaks_users_UserId",
                table: "UserStreaks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Roles",
                table: "Roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserStreaks",
                table: "UserStreaks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeAllergens",
                table: "RecipeAllergens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuickFixTips",
                table: "QuickFixTips");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AuditLogs",
                table: "AuditLogs");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "roles");

            migrationBuilder.RenameTable(
                name: "Permissions",
                newName: "permissions");

            migrationBuilder.RenameTable(
                name: "UserStreaks",
                newName: "user_streaks");

            migrationBuilder.RenameTable(
                name: "UserRoles",
                newName: "user_roles");

            migrationBuilder.RenameTable(
                name: "RecipeAllergens",
                newName: "recipe_allergens");

            migrationBuilder.RenameTable(
                name: "QuickFixTips",
                newName: "quick_fix_tips");

            migrationBuilder.RenameTable(
                name: "AuditLogs",
                newName: "audit_logs");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "roles",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "roles",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "roles",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Recipes",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ProteinG",
                table: "Recipes",
                newName: "protein_g");

            migrationBuilder.RenameColumn(
                name: "ImageFileId",
                table: "Recipes",
                newName: "image_file_id");

            migrationBuilder.RenameColumn(
                name: "FatG",
                table: "Recipes",
                newName: "fat_g");

            migrationBuilder.RenameColumn(
                name: "CarbsG",
                table: "Recipes",
                newName: "carbs_g");

            migrationBuilder.RenameIndex(
                name: "IX_Recipes_ImageFileId",
                table: "Recipes",
                newName: "IX_Recipes_image_file_id");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "permissions",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "permissions",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "permissions",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Files",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UploadedBy",
                table: "Files",
                newName: "uploaded_by");

            migrationBuilder.RenameColumn(
                name: "FileSize",
                table: "Files",
                newName: "file_size");

            migrationBuilder.RenameColumn(
                name: "FilePath",
                table: "Files",
                newName: "file_path");

            migrationBuilder.RenameColumn(
                name: "EntityId",
                table: "Files",
                newName: "entity_id");

            migrationBuilder.RenameColumn(
                name: "UploaderId",
                table: "Files",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Files_UploaderId",
                table: "Files",
                newName: "IX_Files_UserId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Badges",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Badges",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Badges",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "BadgeIconId",
                table: "Badges",
                newName: "badge_icon_id");

            migrationBuilder.RenameIndex(
                name: "IX_Badges_BadgeIconId",
                table: "Badges",
                newName: "IX_Badges_badge_icon_id");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "user_streaks",
                newName: "updated_by");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "user_streaks",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "StreakFreezeCount",
                table: "user_streaks",
                newName: "streak_freeze_count");

            migrationBuilder.RenameColumn(
                name: "LastActivityDate",
                table: "user_streaks",
                newName: "last_activity_date");

            migrationBuilder.RenameColumn(
                name: "HighestStreak",
                table: "user_streaks",
                newName: "highest_streak");

            migrationBuilder.RenameColumn(
                name: "CurrentStreak",
                table: "user_streaks",
                newName: "current_streak");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "user_streaks",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "user_streaks",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "user_streaks",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "user_roles",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "user_roles",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "RoleId",
                table: "user_roles",
                newName: "role_id");

            migrationBuilder.RenameColumn(
                name: "AssignedAt",
                table: "user_roles",
                newName: "assigned_at");

            migrationBuilder.RenameIndex(
                name: "IX_UserRoles_UserId",
                table: "user_roles",
                newName: "IX_user_roles_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_UserRoles_RoleId",
                table: "user_roles",
                newName: "IX_user_roles_role_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "recipe_allergens",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "RecipeId",
                table: "recipe_allergens",
                newName: "recipe_id");

            migrationBuilder.RenameColumn(
                name: "AllergyId",
                table: "recipe_allergens",
                newName: "allergy_id");

            migrationBuilder.RenameIndex(
                name: "IX_RecipeAllergens_RecipeId",
                table: "recipe_allergens",
                newName: "IX_recipe_allergens_recipe_id");

            migrationBuilder.RenameIndex(
                name: "IX_RecipeAllergens_AllergyId",
                table: "recipe_allergens",
                newName: "IX_recipe_allergens_allergy_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "quick_fix_tips",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Entity",
                table: "audit_logs",
                newName: "entity");

            migrationBuilder.RenameColumn(
                name: "Action",
                table: "audit_logs",
                newName: "action");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "audit_logs",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "audit_logs",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "OldValue",
                table: "audit_logs",
                newName: "old_value");

            migrationBuilder.RenameColumn(
                name: "NewValue",
                table: "audit_logs",
                newName: "new_value");

            migrationBuilder.RenameColumn(
                name: "IpAddress",
                table: "audit_logs",
                newName: "ip_address");

            migrationBuilder.RenameColumn(
                name: "EntityId",
                table: "audit_logs",
                newName: "entity_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "audit_logs",
                newName: "created_at");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "roles",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "permissions",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Notifications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "entity",
                table: "audit_logs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "action",
                table: "audit_logs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "id",
                table: "audit_logs",
                type: "nvarchar(36)",
                maxLength: 36,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ip_address",
                table: "audit_logs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "endpoint",
                table: "audit_logs",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "http_method",
                table: "audit_logs",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "trace_id",
                table: "audit_logs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "user_name",
                table: "audit_logs",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_roles",
                table: "roles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_permissions",
                table: "permissions",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_user_streaks",
                table: "user_streaks",
                column: "user_id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_user_roles",
                table: "user_roles",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_recipe_allergens",
                table: "recipe_allergens",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_quick_fix_tips",
                table: "quick_fix_tips",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_audit_logs",
                table: "audit_logs",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IX_Files_uploaded_by",
                table: "Files",
                column: "uploaded_by");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_action",
                table: "audit_logs",
                column: "action");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_created_at",
                table: "audit_logs",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_entity",
                table: "audit_logs",
                column: "entity");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_user_id",
                table: "audit_logs",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Badges_Files_badge_icon_id",
                table: "Badges",
                column: "badge_icon_id",
                principalTable: "Files",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_users_UserId",
                table: "Files",
                column: "UserId",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_users_uploaded_by",
                table: "Files",
                column: "uploaded_by",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_recipe_allergens_Recipes_recipe_id",
                table: "recipe_allergens",
                column: "recipe_id",
                principalTable: "Recipes",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_recipe_allergens_allergies_allergy_id",
                table: "recipe_allergens",
                column: "allergy_id",
                principalTable: "allergies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_Files_image_file_id",
                table: "Recipes",
                column: "image_file_id",
                principalTable: "Files",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_permissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId",
                principalTable: "permissions",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_roles_RoleId",
                table: "RolePermissions",
                column: "RoleId",
                principalTable: "roles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_roles_role_id",
                table: "user_roles",
                column: "role_id",
                principalTable: "roles",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_roles_users_user_id",
                table: "user_roles",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_user_streaks_users_user_id",
                table: "user_streaks",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Badges_Files_badge_icon_id",
                table: "Badges");

            migrationBuilder.DropForeignKey(
                name: "FK_Files_users_UserId",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_Files_users_uploaded_by",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_recipe_allergens_Recipes_recipe_id",
                table: "recipe_allergens");

            migrationBuilder.DropForeignKey(
                name: "FK_recipe_allergens_allergies_allergy_id",
                table: "recipe_allergens");

            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_Files_image_file_id",
                table: "Recipes");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_permissions_PermissionId",
                table: "RolePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissions_roles_RoleId",
                table: "RolePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_roles_role_id",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "FK_user_roles_users_user_id",
                table: "user_roles");

            migrationBuilder.DropForeignKey(
                name: "FK_user_streaks_users_user_id",
                table: "user_streaks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_roles",
                table: "roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_permissions",
                table: "permissions");

            migrationBuilder.DropIndex(
                name: "IX_Files_uploaded_by",
                table: "Files");

            migrationBuilder.DropPrimaryKey(
                name: "PK_user_streaks",
                table: "user_streaks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_user_roles",
                table: "user_roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_recipe_allergens",
                table: "recipe_allergens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_quick_fix_tips",
                table: "quick_fix_tips");

            migrationBuilder.DropPrimaryKey(
                name: "PK_audit_logs",
                table: "audit_logs");

            migrationBuilder.DropIndex(
                name: "IX_audit_logs_action",
                table: "audit_logs");

            migrationBuilder.DropIndex(
                name: "IX_audit_logs_created_at",
                table: "audit_logs");

            migrationBuilder.DropIndex(
                name: "IX_audit_logs_entity",
                table: "audit_logs");

            migrationBuilder.DropIndex(
                name: "IX_audit_logs_user_id",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "endpoint",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "http_method",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "trace_id",
                table: "audit_logs");

            migrationBuilder.DropColumn(
                name: "user_name",
                table: "audit_logs");

            migrationBuilder.RenameTable(
                name: "roles",
                newName: "Roles");

            migrationBuilder.RenameTable(
                name: "permissions",
                newName: "Permissions");

            migrationBuilder.RenameTable(
                name: "user_streaks",
                newName: "UserStreaks");

            migrationBuilder.RenameTable(
                name: "user_roles",
                newName: "UserRoles");

            migrationBuilder.RenameTable(
                name: "recipe_allergens",
                newName: "RecipeAllergens");

            migrationBuilder.RenameTable(
                name: "quick_fix_tips",
                newName: "QuickFixTips");

            migrationBuilder.RenameTable(
                name: "audit_logs",
                newName: "AuditLogs");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Roles",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Roles",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Roles",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Recipes",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "protein_g",
                table: "Recipes",
                newName: "ProteinG");

            migrationBuilder.RenameColumn(
                name: "image_file_id",
                table: "Recipes",
                newName: "ImageFileId");

            migrationBuilder.RenameColumn(
                name: "fat_g",
                table: "Recipes",
                newName: "FatG");

            migrationBuilder.RenameColumn(
                name: "carbs_g",
                table: "Recipes",
                newName: "CarbsG");

            migrationBuilder.RenameIndex(
                name: "IX_Recipes_image_file_id",
                table: "Recipes",
                newName: "IX_Recipes_ImageFileId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Permissions",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Permissions",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Permissions",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Files",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "uploaded_by",
                table: "Files",
                newName: "UploadedBy");

            migrationBuilder.RenameColumn(
                name: "file_size",
                table: "Files",
                newName: "FileSize");

            migrationBuilder.RenameColumn(
                name: "file_path",
                table: "Files",
                newName: "FilePath");

            migrationBuilder.RenameColumn(
                name: "entity_id",
                table: "Files",
                newName: "EntityId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Files",
                newName: "UploaderId");

            migrationBuilder.RenameIndex(
                name: "IX_Files_UserId",
                table: "Files",
                newName: "IX_Files_UploaderId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Badges",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Badges",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Badges",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "badge_icon_id",
                table: "Badges",
                newName: "BadgeIconId");

            migrationBuilder.RenameIndex(
                name: "IX_Badges_badge_icon_id",
                table: "Badges",
                newName: "IX_Badges_BadgeIconId");

            migrationBuilder.RenameColumn(
                name: "updated_by",
                table: "UserStreaks",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "UserStreaks",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "streak_freeze_count",
                table: "UserStreaks",
                newName: "StreakFreezeCount");

            migrationBuilder.RenameColumn(
                name: "last_activity_date",
                table: "UserStreaks",
                newName: "LastActivityDate");

            migrationBuilder.RenameColumn(
                name: "highest_streak",
                table: "UserStreaks",
                newName: "HighestStreak");

            migrationBuilder.RenameColumn(
                name: "current_streak",
                table: "UserStreaks",
                newName: "CurrentStreak");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "UserStreaks",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "UserStreaks",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "UserStreaks",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "UserRoles",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "UserRoles",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "role_id",
                table: "UserRoles",
                newName: "RoleId");

            migrationBuilder.RenameColumn(
                name: "assigned_at",
                table: "UserRoles",
                newName: "AssignedAt");

            migrationBuilder.RenameIndex(
                name: "IX_user_roles_user_id",
                table: "UserRoles",
                newName: "IX_UserRoles_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_user_roles_role_id",
                table: "UserRoles",
                newName: "IX_UserRoles_RoleId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "RecipeAllergens",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "recipe_id",
                table: "RecipeAllergens",
                newName: "RecipeId");

            migrationBuilder.RenameColumn(
                name: "allergy_id",
                table: "RecipeAllergens",
                newName: "AllergyId");

            migrationBuilder.RenameIndex(
                name: "IX_recipe_allergens_recipe_id",
                table: "RecipeAllergens",
                newName: "IX_RecipeAllergens_RecipeId");

            migrationBuilder.RenameIndex(
                name: "IX_recipe_allergens_allergy_id",
                table: "RecipeAllergens",
                newName: "IX_RecipeAllergens_AllergyId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "QuickFixTips",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "entity",
                table: "AuditLogs",
                newName: "Entity");

            migrationBuilder.RenameColumn(
                name: "action",
                table: "AuditLogs",
                newName: "Action");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "AuditLogs",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "AuditLogs",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "old_value",
                table: "AuditLogs",
                newName: "OldValue");

            migrationBuilder.RenameColumn(
                name: "new_value",
                table: "AuditLogs",
                newName: "NewValue");

            migrationBuilder.RenameColumn(
                name: "ip_address",
                table: "AuditLogs",
                newName: "IpAddress");

            migrationBuilder.RenameColumn(
                name: "entity_id",
                table: "AuditLogs",
                newName: "EntityId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "AuditLogs",
                newName: "CreatedAt");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Permissions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Entity",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Action",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "AuditLogs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(36)",
                oldMaxLength: 36);

            migrationBuilder.AlterColumn<string>(
                name: "IpAddress",
                table: "AuditLogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Roles",
                table: "Roles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserStreaks",
                table: "UserStreaks",
                column: "UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeAllergens",
                table: "RecipeAllergens",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuickFixTips",
                table: "QuickFixTips",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AuditLogs",
                table: "AuditLogs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Badges_Files_BadgeIconId",
                table: "Badges",
                column: "BadgeIconId",
                principalTable: "Files",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_users_UploaderId",
                table: "Files",
                column: "UploaderId",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeAllergens_Recipes_RecipeId",
                table: "RecipeAllergens",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeAllergens_allergies_AllergyId",
                table: "RecipeAllergens",
                column: "AllergyId",
                principalTable: "allergies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_Files_ImageFileId",
                table: "Recipes",
                column: "ImageFileId",
                principalTable: "Files",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_Permissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId",
                principalTable: "Permissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissions_Roles_RoleId",
                table: "RolePermissions",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                table: "UserRoles",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_users_UserId",
                table: "UserRoles",
                column: "UserId",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserStreaks_users_UserId",
                table: "UserStreaks",
                column: "UserId",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
